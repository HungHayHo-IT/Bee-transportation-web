import { backendUrl, isConfigured } from './backend';

/**
 * The newsroom feed, as the landing page sees it.
 *
 * Every reader of the BeeOps news API goes through here — the list page, the
 * article page, the /api/news proxies and the sitemap — because the response
 * shape is the one thing on this site that has already broken a deploy once.
 * One unwrapper, exercised by four callers, is far harder to get wrong than
 * four hand-rolled ones.
 */

export interface NewsSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string;
}

export interface NewsDetail extends NewsSummary {
  /** Lexical-authored HTML — see ArticleBody for why it is rendered raw. */
  body: string;
}

/**
 * BeeOps wraps every response in { success, data, meta }, and its list
 * endpoints put { items, total, page, limit } inside `data` rather than a bare
 * array. components/sections/Team.tsx is the scar tissue: it read `body.data`
 * straight and called .map on it, which stopped being an array the day the
 * pagination shape landed — that took out the prerender of /vi-vn and three
 * deploys with it.
 *
 * So peel defensively and accept all three shapes an endpoint has ever
 * returned: a bare array, the pagination wrapper, and the wrapper inside the
 * envelope. Anything else yields null, which every caller renders as "nothing
 * to show" — never as a crash during static generation.
 */
function unwrapList<T>(body: unknown, depth = 0): T[] | null {
  if (Array.isArray(body)) return body as T[];
  if (typeof body !== 'object' || body === null) return null;
  // The envelope can only nest so far; a cycle would otherwise spin here.
  if (depth > 3) return null;
  const { data, items } = body as { data?: unknown; items?: unknown };
  if (Array.isArray(items)) return items as T[];
  if (data !== undefined) return unwrapList<T>(data, depth + 1);
  return null;
}

/**
 * The single-object counterpart. A detail endpoint has no `items`, so the only
 * peeling needed is the envelope — but it must still refuse anything that is
 * not an object with the fields the page reads, or a 200 carrying an error
 * body would render as an article with `undefined` for a title.
 */
function unwrapDetail(body: unknown, depth = 0): NewsDetail | null {
  if (typeof body !== 'object' || body === null) return null;
  if (depth > 3) return null;
  const candidate = body as Partial<NewsDetail> & { data?: unknown };
  if (
    typeof candidate.slug === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.body === 'string'
  ) {
    return candidate as NewsDetail;
  }
  if (candidate.data !== undefined) return unwrapDetail(candidate.data, depth + 1);
  return null;
}

/**
 * How long a newsroom page may be served from cache. Short enough that an
 * article published from the admin shows up on the site within the minute,
 * long enough that a burst of traffic does not become a burst of backend
 * requests.
 *
 * This is also what makes the article route work at all: the fetch below is
 * the only revalidating fetch on that segment, so Next gives the page ISR at
 * this interval while the sibling service pages, which fetch nothing, stay
 * fully static.
 */
export const NEWS_REVALIDATE = 60;

/** The comp lays out twelve cards — four rows of three — and carries no pager. */
export const NEWS_PAGE_SIZE = 12;

/**
 * Published articles, newest first. Returns an empty array both when there is
 * genuinely nothing published and when the backend is unreachable: the list
 * page draws the same empty state for both, and a marketing page has nothing
 * useful to say about an upstream 502 anyway.
 *
 * Called from server components directly rather than through /api/news, the
 * way Team.tsx calls the representatives endpoint — one hop fewer when we are
 * already on the server, and Next owns the caching. The proxy exists for the
 * browser.
 */
export async function fetchNewsList(limit = NEWS_PAGE_SIZE): Promise<NewsSummary[]> {
  if (!isConfigured()) return [];
  try {
    const res = await fetch(backendUrl(`/public/news?page=1&limit=${limit}`), {
      next: { revalidate: NEWS_REVALIDATE },
    });
    if (!res.ok) return [];
    return unwrapList<NewsSummary>(await res.json()) ?? [];
  } catch {
    return [];
  }
}

/**
 * One article, or null when it does not exist, is not published, or the
 * backend is down. The caller turns null into a 404 — which is the right
 * answer for an unknown slug and an acceptable one for an outage, since the
 * page is revalidated and will heal on its own.
 */
export async function fetchNewsArticle(slug: string): Promise<NewsDetail | null> {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(backendUrl(`/public/news/${encodeURIComponent(slug)}`), {
      next: { revalidate: NEWS_REVALIDATE },
    });
    if (!res.ok) return null;
    return unwrapDetail(await res.json());
  } catch {
    return null;
  }
}

/**
 * Publication date in the reader's language. The time zone is pinned rather
 * than left to the host: a build machine on UTC and a serverless region on
 * something else would otherwise disagree about which day an evening post went
 * out, and the page is rendered in both places.
 */
export function formatPublishedAt(iso: string, htmlLang: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(htmlLang, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date);
}
