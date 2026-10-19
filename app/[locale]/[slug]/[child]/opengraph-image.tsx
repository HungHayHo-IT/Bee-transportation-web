import { ImageResponse } from 'next/og';

import { getContent } from '@/lib/i18n';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og';
import { slugFor } from '@/lib/routes';
import { serviceKeyFromSlug } from '@/lib/services';

/**
 * A card per service, carrying that service's name under a "Services" kicker.
 *
 * The kicker earns its place here in a way it does not on the section pages:
 * "Vận chuyển nội địa" on its own could be a page, a product or a headline, and
 * the line above it says which.
 *
 * This level also holds newsroom articles — see the route beside this file —
 * and they get the plain site card instead. An article's own title would mean
 * reaching into the CMS from the image renderer for a picture that is mostly
 * read as "a post from this company", and the article's cover already serves
 * as its share image wherever it has one.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { params: Promise<{ locale: string; slug: string; child: string }> };

async function resolve(params: Params['params']) {
  const { locale, slug, child } = await params;
  const typed: Locale = isLocale(locale) ? locale : 'vi-vn';
  const dict = await getContent(typed);

  if (slug !== slugFor('services', typed)) return { dict, title: dict.og.homeTitle };

  const key = serviceKeyFromSlug(child, typed);
  if (!key) return { dict, title: dict.og.homeTitle };
  return { dict, title: dict.services.items[key].name, kicker: dict.nav.services };
}

export default async function OpengraphImage({ params }: Params) {
  const { dict, title, kicker } = await resolve(params);

  return new ImageResponse(ogCard({ kicker, title, facts: dict.og.facts }), size);
}
