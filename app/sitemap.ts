import type { MetadataRoute } from 'next';

import { DEFAULT_LOCALE, HTML_LANG, LOCALES } from '@/lib/i18n/config';
import { fetchNewsList } from '@/lib/news';
import {
  RENDERED_KEYS,
  alternatesFor,
  articleCanonical,
  pathFor,
  duongDanDichVuThem,
  pathForService,
  serviceAlternates,
  type PageKey,
} from '@/lib/routes';
import { SERVICE_KEYS } from '@/lib/services';
import { fetchDichVuThem, slugThem } from '@/lib/services-them';
import { SITE_URL } from '@/lib/site';

/**
 * Generated from the routing tables, so a page cannot be added without
 * appearing here. Each entry also declares its translations, which is what
 * tells a search engine the two language trees are the same pages rather than
 * duplicates competing with each other.
 */

/** Turn a locale-segment map into the hreflang map the sitemap wants. */
function languagesFor(bySegment: Record<string, string>, xDefault: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[HTML_LANG[locale]] = `${SITE_URL}${bySegment[locale]}`;
  }
  languages['x-default'] = `${SITE_URL}${xDefault}`;
  return languages;
}

/**
 * Dựng lại theo TỪNG LƯỢT XEM, không dựng sẵn lúc build.
 *
 * Mặc định Next coi sitemap.ts là route tĩnh và sinh ra một tệp cố định lúc
 * build. Khi đó thêm một dịch vụ từ CMS thì trang dịch vụ lên ngay, còn sitemap
 * vẫn là bản cũ cho tới lần deploy sau — đã đo trên production: `revalidateTag`
 * không đụng tới nó, và cả `revalidatePath('/sitemap.xml')` cũng không, vì tệp
 * tĩnh nằm ở cache biên chứ không phải một trang ISR.
 *
 * Hậu quả đúng vào chỗ đau nhất: trang mới tạo ra là để máy tìm kiếm thấy.
 *
 * Giá phải trả gần như bằng không: sitemap chỉ có máy tìm kiếm đọc, vài lần
 * một ngày, và mỗi lượt chỉ là hai truy vấn danh mục nhỏ.
 */
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const keys: (PageKey | 'home')[] = ['home', ...RENDERED_KEYS];

  const pages = LOCALES.flatMap((locale) =>
    keys.map((key) => ({
      url: `${SITE_URL}${pathFor(key, locale)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      // The home page is the entry point; sections sit just below it.
      priority: key === 'home' ? 1 : 0.8,
      alternates: {
        languages: languagesFor(alternatesFor(key), pathFor(key, DEFAULT_LOCALE)),
      },
    })),
  );

  // The nine service pages, one level below the services page. Same shape, so
  // adding a service to lib/services.ts puts it in the sitemap automatically.
  const services = LOCALES.flatMap((locale) =>
    SERVICE_KEYS.map((key) => ({
      url: `${SITE_URL}${pathForService(key, locale)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: languagesFor(
          serviceAlternates(key),
          pathForService(key, DEFAULT_LOCALE),
        ),
      },
    })),
  );

  /* Dịch vụ người dùng tự thêm. Cũng là trang thật, cũng có bản hai ngôn ngữ,
     nên vào sitemap y như chín trang gốc. Lấy hụt danh sách thì mất mấy dòng
     này trong một lần deploy, không làm hỏng cả sitemap — xem fetchDichVuThem. */
  const them = await fetchDichVuThem();
  const dichVuThem = LOCALES.flatMap((locale) =>
    them.map((sv) => ({
      url: `${SITE_URL}${duongDanDichVuThem(slugThem(sv, locale), locale)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: languagesFor(
          Object.fromEntries(
            LOCALES.map((l) => [l, duongDanDichVuThem(slugThem(sv, l), l)]),
          ),
          duongDanDichVuThem(slugThem(sv, DEFAULT_LOCALE), DEFAULT_LOCALE),
        ),
      },
    })),
  );

  /**
   * Articles, at their canonical (Vietnamese) URL only — the English path
   * serves the same words, and listing both would offer a search engine a
   * duplicate rather than a second page. No alternates for the same reason.
   *
   * Best-effort on purpose: `fetchNewsList` answers an empty array when the
   * backend is unreachable, so a backend that is down during a build costs the
   * sitemap its articles for one deploy instead of costing us the deploy.
   */
  const articles = (await fetchNewsList(100)).map((article) => ({
    url: `${SITE_URL}${articleCanonical(article.slug)}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }));

  return [...pages, ...services, ...dichVuThem, ...articles];
}
