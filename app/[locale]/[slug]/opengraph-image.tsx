import { ImageResponse } from 'next/og';

import { getContent } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og';
import { pageKeyFromSlug } from '@/lib/routes';

/**
 * A card per section page, carrying that page's own name.
 *
 * Every inner page used to share the home card, so a link to "Kho bãi & phân
 * phối" and a link to the home page were indistinguishable once posted.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { params: Promise<{ locale: string; slug: string }> };

/** The page's own name, or the site name if the slug is not one of ours. */
async function resolve(params: Params['params']) {
  const { locale, slug } = await params;
  const typed = isLocale(locale) ? locale : 'vi-vn';
  const dict = await getContent(typed);
  const key = pageKeyFromSlug(slug, typed);
  // `services` is a URL segment rather than a page — see RENDERED_KEYS.
  const title = key && key !== 'services' ? dict.nav[key] : dict.og.homeTitle;
  return { dict, title };
}

export default async function OpengraphImage({ params }: Params) {
  const { dict, title } = await resolve(params);

  // No kicker: the headline is already the page's own name, and the mark above
  // it says whose page it is. A kicker here would only repeat one or the other.
  return new ImageResponse(ogCard({ title, facts: dict.og.facts }), size);
}
