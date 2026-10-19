import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BlogList } from '@/components/sections/blog';
import { LegalDocument } from '@/components/sections/legal';
import {
  Contact,
  CtaBand,
  Fleet,
  Why,
} from '@/components/sections';
import {
  CrossBorderCorridors,
  CrossBorderHero,
  CrossBorderRoutes,
  Lifting,
  Tracking,
  WarehouseHero,
  WarehouseTrust,
  WarehouseTypes,
} from '@/components/sections/capability';
import { getContent } from '@/lib/i18n';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { fetchNewsList } from '@/lib/news';
import {
  LEGAL_KEYS,
  allPagePaths,
  dichVuRiengTuSlug,
  pageKeyFromSlug,
  pathFor,
  type PageKey,
} from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { ServicePageBody, serviceMetadata } from '@/components/sections/service-page';
import type { ServiceKey } from '@/lib/services';

/**
 * One catch-all route serves every inner page, in both languages, because the
 * slugs are localised (`/vi-vn/dich-vu` vs `/en-us/services`). A folder per page
 * would mean either English slugs on the Vietnamese site — throwing away the
 * keywords that matter most here — or twelve near-identical folders kept in
 * sync by hand. The slug table in lib/routes.ts is the single source instead,
 * and it feeds routing, metadata, hreflang and the sitemap alike.
 */

/** Every (locale, slug) pair is known at build time, so all of them prerender. */
export function generateStaticParams() {
  return allPagePaths();
}

/** A slug outside the table is a 404, not a dynamically rendered page. */
export const dynamicParams = false;

type Params = Promise<{ locale: string; slug: string }>;

/**
 * Hai thứ sống ở cấp này: một trang trong bảng slug, hoặc một DỊCH VỤ có trang
 * riêng (Vận chuyển nội địa). Dịch vụ đó không nằm trong bảng trang vì nó
 * không có mục `meta` riêng — chữ SEO của nó nằm cùng chỗ với tám dịch vụ kia,
 * trong `services.items`.
 */
type Resolved =
  | { kind: 'page'; locale: Locale; key: PageKey }
  | { kind: 'service'; locale: Locale; key: ServiceKey };

async function resolve(params: Params): Promise<Resolved | null> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return null;

  const key = pageKeyFromSlug(slug, locale);
  // `services` is a URL segment, not a page — see RENDERED_KEYS.
  if (key && key !== 'services') return { kind: 'page', locale, key };

  const dichVu = dichVuRiengTuSlug(slug, locale);
  return dichVu ? { kind: 'service', locale, key: dichVu } : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};
  return resolved.kind === 'service'
    ? serviceMetadata(resolved.locale, resolved.key)
    : pageMetadata(resolved.locale, resolved.key);
}

export default async function InnerPage({ params }: { params: Params }) {
  const resolved = await resolve(params);
  if (!resolved) notFound();

  if (resolved.kind === 'service') {
    const dict = await getContent(resolved.locale);
    return (
      <main id="top" className="page page-slides">
        <ServicePageBody locale={resolved.locale} dict={dict} service={resolved.key} />
      </main>
    );
  }

  const { locale, key } = resolved;
  const dict = await getContent(locale);

  /**
   * The newsroom is the one page here whose content is not in the dictionary.
   * Fetching it at the top rather than inside the section keeps the component
   * a pure renderer, and the revalidating fetch inside `fetchNewsList` is what
   * turns this one page into ISR while its eleven siblings stay fully static.
   */
  const articles = key === 'blog' ? await fetchNewsList() : [];

  /**
   * B-03 — every section page gets the trail the service pages already had,
   * both on screen and as BreadcrumbList; the two come from one list, so they
   * cannot disagree.
   */
  const trail = (
    <Breadcrumbs locale={locale} label={dict.nav[key]} trail={[{ name: dict.nav[key] }]} />
  );

  /**
   * Pages that open on a full-screen photograph put it above the trail, so the
   * screen starts with the hero rather than with a breadcrumb pushing it down.
   */
  /** The legal pages are a light document that carries the trail itself. */
  const isLegal = key === 'privacy' || key === 'terms';
  /**
   * The contact screen is a full-bleed photograph too, so it carries the
   * trail itself rather than having a band of page ground pushed in above
   * it — same reasoning as the two hero pages above.
   */
  const photoLed = key === 'contact';

  /**
   * The newsroom is light too, and for the same reason takes the trail inside
   * its own section: the generic crumbs row sits on the site's dark ground,
   * and a dark strip above a white page is a seam, not a header.
   */
  const carriesOwnTrail = isLegal || key === 'blog';

  const hero =
    key === 'warehousing' ? (
      <WarehouseHero locale={locale} dict={dict} trail={trail} />
    ) : key === 'crossborder' ? (
      <CrossBorderHero dict={dict} trail={trail} />
    ) : null;

  return (
    <main id="top" className={hero ? 'page page-slides' : 'page'}>
      {hero}
      {hero || carriesOwnTrail || photoLed ? null : (
        <div className="wrap page__crumbs">{trail}</div>
      )}

      {key === 'warehousing' && (
        <>
          <WarehouseTypes dict={dict} />
          <WarehouseTrust dict={dict} />
          <CtaBand locale={locale} dict={dict} />
        </>
      )}

      {key === 'crossborder' && (
        <>
          <CrossBorderRoutes dict={dict} />
          <CrossBorderCorridors dict={dict} />
          <CtaBand locale={locale} dict={dict} />
        </>
      )}

      {key === 'capabilities' && (
        <>
          <Fleet locale={locale} dict={dict} as="h1" />
          <Lifting dict={dict} />
          <Tracking dict={dict} />
          <Why dict={dict} />
          <CtaBand locale={locale} dict={dict} />
        </>
      )}

      {key === 'blog' && (
        <>
          <BlogList locale={locale} dict={dict} articles={articles} trail={trail} />
          <CtaBand locale={locale} dict={dict} />
        </>
      )}

      {key === 'contact' && <Contact locale={locale} dict={dict} as="h1" trail={trail} />}

      {isLegal && (
        <>
          <LegalDocument
            page={key === 'privacy' ? dict.legal.privacy : dict.legal.terms}
            khoaGoc={`legal.${key}.sections`}
            site={dict.site}
            trail={trail}
          />
          <CtaBand locale={locale} dict={dict} />
        </>
      )}
    </main>
  );
}
