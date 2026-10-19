import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Reveal } from '@/components/Reveal';
import type { Dictionary } from '@/lib/i18n';
import { HTML_LANG, type Locale } from '@/lib/i18n/config';
import { formatPublishedAt, type NewsDetail, type NewsSummary } from '@/lib/news';
import { pathFor, pathForArticle } from '@/lib/routes';
import { imageProps } from '@/lib/image-slots';

/**
 * The newsroom: an index of article cards, and the article itself. Both take
 * their content from BeeOps and their furniture from the dictionary, so this
 * file holds no copy of its own.
 */

/**
 * A card's cover photograph.
 *
 * Plain <img>, not next/image, and that is a considered choice rather than a
 * shortcut. The URLs are S3 objects written by the admin: the bucket differs
 * per environment, and they arrive pre-signed — a query string that changes on
 * every fetch. next/image would need the host declared in next.config.ts (so a
 * bucket change becomes a code change and a redeploy), and the optimizer keys
 * its cache on the full URL, so a rotating signature means a cache miss and a
 * fresh optimization every single time. It can also expire mid-flight, which
 * next/image turns into a 500 from /_next/image instead of a missing picture.
 *
 * The frame holds a fixed 4:3 box with its own plate colour, so a cover that
 * is missing, still uploading or long expired leaves a tidy blank rectangle
 * and the grid keeps its rhythm. The alt is empty on purpose: the image is
 * decorative next to the title it sits above, and an empty alt also means a
 * broken URL shows nothing rather than a line of stray text across the plate.
 */
function Cover({ src }: { src: string | null }) {
  return (
    <span className="blog-card__frame">
      {src ? (
        <img className="blog-card__img" src={src} alt="" loading="lazy" decoding="async" />
      ) : null}
    </span>
  );
}

export function BlogList({
  locale,
  dict,
  articles,
  trail,
}: {
  locale: Locale;
  dict: Dictionary;
  articles: NewsSummary[];
  /** Rides inside the section, which is the only light ground on this page. */
  trail?: ReactNode;
}) {
  return (
    <section className="section blog">
      <div className="wrap">
        {trail ? <div className="blog__head">{trail}</div> : null}
        <Reveal>
          <h1 className="blog__title">{dict.blog.title}</h1>
        </Reveal>

        {/*
          One empty state for two different causes — nothing published yet, and
          a backend we could not reach (see lib/news.ts). A visitor can act on
          neither, and a marketing page that admits to an upstream error reads
          worse than one that simply has no news this week.
        */}
        {articles.length === 0 ? (
          <Reveal className="blog__empty">
            <p className="blog__empty-title">{dict.blog.emptyTitle}</p>
            <p className="blog__empty-body">{dict.blog.emptyBody}</p>
          </Reveal>
        ) : (
          <ul className="blog__grid" aria-label={dict.blog.listLabel}>
            {articles.map((article, i) => (
              <Reveal as="li" key={article.id} delayIndex={i} className="blog-card">
                {/* The whole card is one link: the title is the accessible
                    name, and the cover above it is part of the same target
                    rather than a second link to the same place. */}
                <Link className="blog-card__link" href={pathForArticle(article.slug, locale)}>
                  <Cover src={article.coverImageUrl} />
                  <h2 className="blog-card__title">{article.title}</h2>
                  {article.excerpt ? (
                    <p className="blog-card__excerpt">{article.excerpt}</p>
                  ) : null}
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/**
 * The article body, as authored.
 *
 * `body` is HTML produced by the Lexical editor in BeeOps admin, so it is
 * rendered straight rather than parsed and rebuilt — the editor already
 * decided what the markup should be, and a second pass here could only lose
 * detail.
 *
 * The trade-off, stated plainly: this is an XSS sink. It is acceptable only
 * because the authors are internal admin staff behind an authenticated editor,
 * which makes the input as trusted as the rest of the codebase. If the day
 * comes that outside contributors, imports or customer submissions can reach
 * the news table, this must be sanitised on the way out before that ships —
 * this component is the one place that would change.
 */
function ArticleBody({ html }: { html: string }) {
  return <div className="article__body" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function BlogArticle({
  locale,
  dict,
  article,
}: {
  locale: Locale;
  dict: Dictionary;
  article: NewsDetail;
}) {
  const published = formatPublishedAt(article.publishedAt, HTML_LANG[locale]);

  return (
    <>
      {/*
        The service detail pages open on a full-bleed photograph with the title
        and its summary held on the dark ground beneath, and an article is the
        same kind of page — so it borrows that hero outright rather than
        inventing a second way to start a page. Where the article has a cover
        of its own, it takes the photograph's place.
      */}
      <section className="page-hero">
        {article.coverImageUrl ? (
          // Same reasoning as Cover above; eager because it is the largest paint.
          <img
            className="page-hero__img article-hero__img"
            src={article.coverImageUrl}
            alt=""
            fetchPriority="high"
          />
        ) : (
          <Image
            {...imageProps('serviceIntroBg', dict.images)}
            alt=""
            fill
            sizes="100vw"
            priority
            className="page-hero__img page-hero__img--truck"
          />
        )}

        <div className="page-hero__panel">
          <div className="wrap page-hero__inner">
            <div className="page-hero__copy">
              <div className="eyebrow">
                <i />
                {dict.blog.articleEyebrow}
              </div>
              <h1 className="page-hero__title">{article.title}</h1>
            </div>
            <div className="page-hero__copy">
              {article.excerpt ? (
                <p className="page-hero__lead">{article.excerpt}</p>
              ) : null}
              {published ? (
                <p className="article__date">
                  {dict.blog.publishedLabel}{' '}
                  {/* The machine-readable date is the raw ISO string; the text
                      beside it is formatted for the reader's language. */}
                  <time dateTime={article.publishedAt}>{published}</time>
                </p>
              ) : null}
            </div>
          </div>
          <div className="wrap page-hero__trail">
            <Breadcrumbs
              locale={locale}
              label={dict.blog.articleEyebrow}
              trail={[
                { name: dict.nav.blog, href: pathFor('blog', locale) },
                { name: article.title },
              ]}
            />
          </div>
        </div>
      </section>

      <article className="section article">
        <div className="wrap wrap--narrow">
          <ArticleBody html={article.body} />

          <p className="article__back">
            <Link href={pathFor('blog', locale)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M19 12H7M11 6l-6 6 6 6" />
              </svg>
              {dict.blog.backToList}
            </Link>
          </p>
        </div>
      </article>
    </>
  );
}
