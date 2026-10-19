import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { CallBar } from '@/components/CallBar';
import { CmsEditor } from '@/components/CmsEditor';
import { SlidePager } from '@/components/SlidePager';
import { JsonLd } from '@/components/JsonLd';
import { SkipLink } from '@/components/SkipLink';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { getContent } from '@/lib/i18n';
import { HTML_LANG, LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { organizationJsonLd } from '@/lib/seo';
import { ORG, SITE_URL } from '@/lib/site';

import '../globals.css';

/**
 * This is the root layout: every route on the site lives under a locale
 * segment, so the topmost layout is the one that knows which language it is
 * rendering and can put a correct `lang` on <html>.
 */

/**
 * Self-hosted by next/font. The previous site pulled this from
 * fonts.googleapis.com, which put a render-blocking stylesheet on a third-party
 * origin directly in front of the largest paint. Served from our own domain
 * instead, with `display: swap` so text is never invisible while it loads.
 *
 * Space Grotesk carries the `vietnamese` subset, which is not something every
 * geometric sans does — check that first before swapping this for another.
 *
 * It tops out at 700. The stylesheet used to ask for 800 in fifteen places and
 * those are now 700; do not reintroduce 800, because the browser would answer
 * it by smearing the 700 face rather than by loading anything.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  // Every weight named here is fetched on every page, so the list is the four
  // the stylesheet actually asks for and nothing else. Check globals.css
  // before adding to it.
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Inner pages set only their own name; this appends the company.
    template: `%s — ${ORG.shortName}`,
    default: ORG.name,
  },
  applicationName: ORG.shortName,
  authors: [{ name: ORG.name }],
  formatDetection: { telephone: true, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // The site is dark end to end; saying so avoids a white flash on the
  // scrollbar and on overscroll.
  colorScheme: 'dark',
  themeColor: '#07090c',
};

/** Both locales are known at build time, so both trees prerender. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * ⚠️ `false` here does not mean what it looks like it means, and this cost an
 * afternoon to find, so it is written down.
 *
 * `dynamicParams` on a *layout* governs the entire tree beneath it, not just
 * the params of its own segment. While this was `false`, no descendant route
 * could serve a path that was not enumerated at build time — and no
 * page-level `dynamicParams = true` underneath it made any difference,
 * because the request was refused before the route ever ran. That is fine for
 * a site whose every URL is in lib/routes.ts, and fatal for the newsroom,
 * whose article slugs are written in the admin after the deploy.
 *
 * So the gate moves down to the segments that can actually judge a param:
 * `[slug]` still refuses anything outside the slug table at build time, and
 * `[child]` decides at request time because it has to ask the backend.
 *
 * Unknown locales are unaffected. `isLocale` below still rejects them — a
 * third language is a 404 the same as before, decided here at request time
 * rather than by the router, at the cost of one array lookup.
 */
export const dynamicParams = true;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typed: Locale = locale;
  const dict = await getContent(typed);

  return (
    <html lang={HTML_LANG[typed]} className={spaceGrotesk.variable}>
      <body>
        <SkipLink dict={dict} />
        <ScrollProgress />
        <Nav locale={typed} dict={dict} />
        {children}
        <Footer locale={typed} dict={dict} />
        <CallBar locale={typed} dict={dict} />
        {/* Chế độ sửa tại chỗ. Chỉ thức dậy khi trang nằm trong khung của màn
            CMS và URL có cờ; khách thường không tốn gì ngoài vài dòng JS. */}
        <CmsEditor />
        {/* Một cú cuộn đi trọn một màn hình trên những trang dựng bằng slide.
            Tự tìm main.home-slides / main.page-slides nên trang thường không
            bị đụng tới. */}
        <SlidePager />
        <JsonLd data={organizationJsonLd(typed)} />
        {/* No cookies, no cross-site identifiers — measurement that does not
            drag a consent banner in behind it. Speed Insights reports LCP from
            real visitors, which is the only honest way to close C-04. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
