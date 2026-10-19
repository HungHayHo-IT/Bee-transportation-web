import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { JsonLd } from '@/components/JsonLd';
import { BlogArticle } from '@/components/sections/blog';
import { CtaBand } from '@/components/sections';
import { ServicePageBody, serviceMetadata } from '@/components/sections/service-page';
import { getContent } from '@/lib/i18n';
import { HTML_LANG, isLocale, LOCALES, type Locale } from '@/lib/i18n/config';
import { fetchNewsArticle, type NewsDetail } from '@/lib/news';
import {
  allServicePaths,
  articleCanonical,
  pathForArticle,
  slugFor,
} from '@/lib/routes';
import { shareImage } from '@/lib/seo';
import { serviceKeyFromSlug, type KhoaDichVu } from '@/lib/services';
import { fetchDichVuThem, slugThem } from '@/lib/services-them';
import { ORG, SITE_URL } from '@/lib/site';

/**
 * The second level of the site, and the only route with two different things
 * living in it: a service line under the services slug
 * (`/vi-vn/dich-vu/van-chuyen-noi-dia`) and a newsroom article under the blog
 * slug (`/vi-vn/tin-tuc/<slug>`). Both segments are localised either way, and
 * all of them come out of the slug tables that build the nav, the sitemap and
 * the hreflang alternates.
 *
 * Why one file rather than two: Next allows exactly one dynamic segment name
 * at a given level, so `[service]` and `[post]` cannot be siblings. The
 * alternative — a literal folder per locale, `blog/[slug]` beside
 * `tin-tuc/[slug]` — would hard-code Vietnamese slugs into the folder tree and
 * break the rule that lib/routes.ts is the only place a URL is spelled. So the
 * segment is named for what it is, the child of whatever sits above it, and
 * `resolve` branches on the parent.
 */

/**
 * Every service path is known at build time and prerenders. Article slugs are
 * deliberately absent: they come from the CMS, and listing them here would
 * make this build reach into the backend for a set of pages that the very next
 * publish invalidates anyway.
 */
export async function generateStaticParams() {
  /* Dịch vụ người dùng tự thêm cũng dựng sẵn được: danh sách của chúng nằm ở
     BeeOps chứ không trong code, nhưng lúc dựng trang vẫn hỏi được. Thêm một
     dịch vụ giữa hai lần deploy thì `dynamicParams` ở dưới lo — trang đó dựng
     lúc có người vào, không phải đợi build. */
  const them = await fetchDichVuThem();
  return [
    ...allServicePaths().map(({ locale, slug, service }) => ({ locale, slug, child: service })),
    ...LOCALES.flatMap((locale) =>
      them.map((sv) => ({
        locale,
        slug: slugFor('services', locale),
        child: slugThem(sv, locale),
      })),
    ),
  ];
}

/**
 * ⚠️ This was `false`, and flipping it changes how the eighteen service pages
 * behave, so it deserves a paragraph.
 *
 * `false` means Next serves only the paths listed above and 404s everything
 * else at this level without ever running the route — and an article published
 * an hour after the deploy is precisely that: a path not in the list. A
 * newsroom whose new posts 404 until someone triggers a rebuild is not a
 * newsroom.
 *
 * With `true`, an unlisted path renders on demand instead. What the service
 * pages *serve* does not change: they still prerender from the list above, and
 * a wrong service slug still ends at `notFound()` below, because `resolve`
 * refuses anything absent from the tables. What changed is *where* that 404 is
 * decided — at request time now, rather than by the router at build time — and
 * the cost of deciding it is two string comparisons that answer null. Verified
 * by hand: /vi-vn/dich-vu/khong-ton-tai is still a 404, /vi-vn/gioi-thieu (an
 * unknown section, one level up) still a 404, /fr-fr still a 404.
 *
 * This flag alone is not enough, and that is the part worth knowing: the
 * locale layout's own `dynamicParams` governs this whole subtree and used to
 * refuse the request before the route ran. See app/[locale]/layout.tsx.
 */
export const dynamicParams = true;

type Params = Promise<{ locale: string; slug: string; child: string }>;

/** A service line, or an article — the two things that can live under here. */
type Resolved =
  | { kind: 'service'; locale: Locale; key: KhoaDichVu }
  | { kind: 'article'; locale: Locale; slug: string };

/**
 * Article slugs are lowercase kebab-case, as the admin editor writes them.
 * Checking the shape before asking the backend keeps encoded traversal and
 * other junk out of the upstream URL, and turns a crawler probing for
 * `wp-login.php` into a 404 that costs nothing rather than a round trip.
 */
const ARTICLE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* Một lượt tải trang tra MỘT lần. generateMetadata và trang cùng gọi resolve;
   tra riêng thì lúc cache danh sách dịch vụ tự thêm đang làm mới, metadata
   thấy dịch vụ còn, trang thấy đã tắt — phần đầu trang đã gửi đi với 200 rồi
   trang mới báo không tìm thấy, thành một trang lỗi trả 200. */
const tra = cache(async (locale: string, slug: string, child: string): Promise<Resolved | null> => {
  if (!isLocale(locale)) return null;

  // The parent segment has to be this locale's own slug — otherwise
  // `/vi-vn/gioi-thieu/van-chuyen-noi-dia` would resolve and the same page
  // would exist at two URLs.
  if (slug === slugFor('services', locale)) {
    const key = serviceKeyFromSlug(child, locale);
    if (key) return { kind: 'service', locale, key };
    /* Không phải một trong chín khoá gốc thì hỏi tiếp danh sách dịch vụ tự
       thêm. Hỏi SAU chứ không hỏi trước: chín trang gốc là phần lớn lưu lượng
       và chúng trả lời được mà không chạm mạng. */
    const them = (await fetchDichVuThem()).find((sv) => slugThem(sv, locale) === child);
    return them ? { kind: 'service', locale, key: them.key } : null;
  }

  if (slug === slugFor('blog', locale)) {
    return ARTICLE_SLUG.test(child) ? { kind: 'article', locale, slug: child } : null;
  }

  return null;
});

async function resolve(params: Params): Promise<Resolved | null> {
  const { locale, slug, child } = await params;
  return tra(locale, slug, child);
}

/**
 * Metadata for an article. No `languages` map: the newsroom holds one copy of
 * each piece, so both locale paths serve identical words — hence
 * `articleCanonical`, which points them at a single URL rather than claiming a
 * translation that does not exist.
 */
function articleMetadata(locale: Locale, article: NewsDetail): Metadata {
  const description = article.excerpt ?? undefined;
  // The cover doubles as the share card where there is one; otherwise the
  // site's own card, which is always present and always the right size.
  const images = article.coverImageUrl
    ? [{ url: article.coverImageUrl }]
    : shareImage(pathForArticle(article.slug, locale), article.title);

  return {
    title: article.title,
    description,
    alternates: { canonical: articleCanonical(article.slug) },
    openGraph: {
      type: 'article',
      siteName: ORG.name,
      locale: HTML_LANG[locale].replace('-', '_'),
      url: `${SITE_URL}${pathForArticle(article.slug, locale)}`,
      title: `${article.title} — ${ORG.shortName}`,
      description,
      publishedTime: article.publishedAt,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} — ${ORG.shortName}`,
      description,
      images,
    },
  };
}

/**
 * One article. The fetch happens twice per request — once for the metadata,
 * once here — and both hits land on the same revalidating fetch cache entry,
 * so it is one round trip in practice.
 */
async function ArticlePage({ locale, slug }: { locale: Locale; slug: string }) {
  const article = await fetchNewsArticle(slug);
  // Unknown slug, unpublished, or the backend is down. All three are a 404 to
  // a reader; the page revalidates, so an outage heals itself.
  if (!article) notFound();

  const dict = await getContent(locale);

  return (
    <main id="top" className="page page-article">
      <BlogArticle locale={locale} dict={dict} article={article} />
      <CtaBand locale={locale} dict={dict} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          description: article.excerpt ?? undefined,
          datePublished: article.publishedAt,
          image: article.coverImageUrl ?? undefined,
          publisher: { '@id': `${SITE_URL}/#organization` },
          mainEntityOfPage: `${SITE_URL}${articleCanonical(article.slug)}`,
        }}
      />
    </main>
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};

  if (resolved.kind === 'article') {
    const article = await fetchNewsArticle(resolved.slug);
    return article ? articleMetadata(resolved.locale, article) : {};
  }

  return serviceMetadata(resolved.locale, resolved.key);
}

export default async function ChildPage({ params }: { params: Params }) {
  const resolved = await resolve(params);
  if (!resolved) notFound();

  if (resolved.kind === 'article') {
    return <ArticlePage locale={resolved.locale} slug={resolved.slug} />;
  }

  const { locale, key } = resolved;
  const dict = await getContent(locale);

  return (
    <main id="top" className="page page-slides">
      <ServicePageBody locale={locale} dict={dict} service={key} />
    </main>
  );
}
