import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Hero } from '@/components/hero/Hero';
import {
  AboutDetail,
  AboutIntro,
  AppDownload,
  CtaBand,
  HomeFaq,
  Partners,
  ServicesSlide,
  Team,
} from '@/components/sections';
import { getContent } from '@/lib/i18n';
import { isLocale } from '@/lib/i18n/config';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, 'home');
}

/**
 * The home page: the hero, then a condensed run through what the company does,
 * each block linking on to the page that covers it properly. The full service
 * list, equipment and contact details live on their own pages so each has a
 * URL worth ranking.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getContent(locale);

  return (
    <>
      {/* `home-slides` turns the page into full-screen slides (see the
          HOME SLIDES block in globals.css): everything from the hero down to
          the call to action snaps to fill the viewport. The footer, which
          lives in the layout, is deliberately left out of that. */}
      <main id="top" className="home-slides">
        <Hero locale={locale} dict={dict} />
        <AboutIntro dict={dict} />
        <AboutDetail locale={locale} dict={dict} />
        <ServicesSlide locale={locale} dict={dict} />
        <Partners dict={dict} locale={locale} />
        <AppDownload dict={dict} />
        <HomeFaq dict={dict} />
        {/* Đội ngũ đại diện đứng TRƯỚC lời kêu gọi liên hệ: nó trả lời "ai sẽ
            làm việc với tôi", và đó là thứ người đọc muốn biết ngay trước lúc
            quyết định bấm liên hệ. Khối tự giấu mình khi chưa ai được bật —
            xem Team.tsx. */}
        <Team dict={dict} />
        {/* Off the home page on purpose:

            Marquee and Why, hidden 09/2026 while the home page is slides.
            Restore either by putting it back and re-adding the import:
              <Marquee dict={dict} />
              <Why dict={dict} />
            The services grid is not coming back here — ServicesSlide above is
            the home page's version of it, and `Services` is now only the
            services page's own section.
            The hero engine skips route seams whose element is absent, so
            nothing else needs to change. */}
        <CtaBand locale={locale} dict={dict} />
      </main>
    </>
  );
}
