import { ImageResponse } from 'next/og';

import { getContent } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og';

/**
 * The home page's share card, in the language of the page being shared.
 *
 * It used to be one hardcoded English card served to both locales, which meant
 * a Vietnamese page declared `og:locale = vi_VN` and a Vietnamese title and
 * then handed the reader an English picture.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { params: Promise<{ locale: string }> };

export default async function OpengraphImage({ params }: Params) {
  const { locale } = await params;
  const dict = await getContent(isLocale(locale) ? locale : 'vi-vn');

  return new ImageResponse(
    ogCard({
      title: dict.og.homeTitle,
      accent: dict.og.homeAccent,
      facts: dict.og.facts,
    }),
    size,
  );
}
