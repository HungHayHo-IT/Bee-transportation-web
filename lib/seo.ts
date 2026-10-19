import type { Metadata } from 'next';

import { getContent } from './i18n';
import { HTML_LANG, type Locale, DEFAULT_LOCALE, LOCALES } from './i18n/config';
import { alternatesFor, pathFor, type PageKey } from './routes';
import { ORG, SITE_URL } from './site';

/**
 * `alternates.languages` wants hreflang values, and the URL segments are not
 * hreflang values (`vi-vn` vs `vi-VN`). Translate on the way out, and add
 * `x-default` so a search engine with no language preference is sent to the
 * Vietnamese site rather than picking one at random.
 */
function languageAlternates(key: PageKey | 'home'): Record<string, string> {
  const bySegment = alternatesFor(key);
  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    out[HTML_LANG[locale]] = bySegment[locale]!;
  }
  out['x-default'] = pathFor(key, DEFAULT_LOCALE);
  return out;
}

/**
 * The share card for one page, as an explicit reference.
 *
 * Next only folds the file-based opengraph-image into a route that does not
 * declare `openGraph` itself — and every route here declares one, so the image
 * has to be named rather than inherited.
 *
 * It takes the page's own path, not just the locale: each route level now has
 * its own opengraph-image, so `/vi-vn/kho-bai/opengraph-image` is that page's
 * card. Passing only the locale is what used to give all 32 pages the same
 * picture.
 */
export function shareImage(path: string, title: string) {
  return [
    {
      url: `${path}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: `${title} — ${ORG.name}`,
    },
  ];
}

/**
 * Metadata for one page in one language. Every route builds its metadata here
 * so that canonical, hreflang and Open Graph can never disagree with each
 * other or with the routing table.
 */
export async function pageMetadata(
  locale: Locale,
  key: PageKey | 'home',
): Promise<Metadata> {
  const dict = await getContent(locale);
  const entry = dict.meta[key === 'home' ? 'home' : key];
  const path = pathFor(key, locale);
  const url = `${SITE_URL}${path}`;

  // Only the home page carries the full brand title; inner pages get the
  // template from the root layout, which appends the company name.
  const title = key === 'home' ? { absolute: entry.title } : entry.title;

  return {
    title,
    description: entry.description,
    alternates: {
      canonical: path,
      languages: languageAlternates(key),
    },
    openGraph: {
      type: 'website',
      siteName: dict.site.name,
      locale: HTML_LANG[locale].replace('-', '_'),
      url,
      title: key === 'home' ? entry.title : `${entry.title} — ${dict.site.shortName}`,
      description: entry.description,
      images: shareImage(path, entry.title),
    },
    twitter: {
      card: 'summary_large_image',
      title: key === 'home' ? entry.title : `${entry.title} — ${dict.site.shortName}`,
      description: entry.description,
      images: shareImage(path, entry.title),
    },
  };
}

/**
 * Organization structured data, emitted once per page from the locale layout.
 * Built from lib/site.ts so the phone numbers and addresses in the markup and
 * in the rich result can never drift apart.
 */
export function organizationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG.name,
    alternateName: ORG.shortName,
    url: `${SITE_URL}${pathFor('home', locale)}`,
    foundingDate: ORG.founded,
    email: ORG.email,
    address: ORG.offices.map((office) => ({
      '@type': 'PostalAddress',
      streetAddress: office.street,
      addressLocality: office.city,
      addressCountry: office.country,
    })),
    contactPoint: ORG.phones.map((phone) => ({
      '@type': 'ContactPoint',
      telephone: phone.e164,
      contactType: 'sales',
      areaServed: 'VN',
      availableLanguage: ['vi', 'en'],
    })),
  };
}
