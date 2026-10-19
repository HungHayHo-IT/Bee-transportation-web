import {
  SERVICE_KEYS, serviceKeyFromSlug, serviceSlug, type KhoaDichVu, type ServiceKey,
} from './services';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './i18n/config';

/**
 * Every page other than the home page is addressed by a stable key, and each
 * key has a slug per locale. Keeping the Vietnamese slugs in Vietnamese is
 * worth real search traffic; keeping the key stable means links, metadata and
 * hreflang alternates are all derived from one place rather than hand-kept in
 * sync across languages.
 */
/**
 * Pages that appear in the main navigation, in the order they are shown.
 *
 * `blog` sits here but not in the header on purpose. It is a real page
 * with a real slug, and the footer's "Company" column is built from this list,
 * so it gets a permanent link there — but it is not what someone with freight
 * to move came for, and the header is already carrying the services menu. The
 * comp agrees: neither the header nor the footer in the approved design puts
 * the newsroom in the bar.
 */
export const NAV_KEYS = [
  'services',
  'warehousing',
  'crossborder',
  'capabilities',
  'blog',
  'contact',
] as const;

/* What the header and footer list — pages and services mixed — lives in
   lib/navigation.ts. */

/**
 * Legal pages. Real routes with their own slugs, but deliberately out of the
 * navigation — they belong in the footer, next to the company details.
 */
export const LEGAL_KEYS = ['privacy', 'terms'] as const;

/** Every page that has a URL, navigation or not. */
export const PAGE_KEYS = [...NAV_KEYS, ...LEGAL_KEYS] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

/**
 * The keys that actually have a page. `services` keeps its slug because the
 * nine service pages are nested under it and their URLs are built from it, but
 * there is no index of them any more — the header opens the nine directly.
 */
export const RENDERED_KEYS = PAGE_KEYS.filter((key) => key !== 'services');

const SLUGS: Record<PageKey, Record<Locale, string>> = {
  services: { 'vi-vn': 'dich-vu', 'en-us': 'services' },
  warehousing: { 'vi-vn': 'kho-bai', 'en-us': 'warehousing' },
  crossborder: { 'vi-vn': 'xuyen-bien-gioi', 'en-us': 'cross-border' },
  capabilities: { 'vi-vn': 'nang-luc', 'en-us': 'capabilities' },
  // The newsroom is filed under the word each market actually searches for:
  // "tin tuc" in Vietnamese, "blog" in English. Same key, same page, two slugs
  // — which is the whole reason this table exists.
  blog: { 'vi-vn': 'tin-tuc', 'en-us': 'blog' },
  contact: { 'vi-vn': 'lien-he', 'en-us': 'contact' },
  privacy: { 'vi-vn': 'chinh-sach-quyen-rieng-tu', 'en-us': 'privacy-policy' },
  terms: { 'vi-vn': 'dieu-khoan-su-dung', 'en-us': 'terms-of-use' },
};

export function slugFor(key: PageKey, locale: Locale): string {
  return SLUGS[key][locale];
}

/* --------------------------------------------------------------------------
   Dịch vụ có trang riêng ở cấp một.

   Vận chuyển nội địa là dịch vụ bán nhiều nhất, nên nó không nằm chung trong
   mục Dịch vụ nữa mà đứng thành một trang riêng ngang hàng với Kho bãi hay
   Xuyên biên giới. Nó VẪN là một dịch vụ với backend và với ô chọn trong form
   báo giá — chỉ chỗ đứng trên site đổi, nên SERVICE_KEYS giữ nguyên và chỉ
   đường dẫn đọc từ bảng này.
   -------------------------------------------------------------------------- */

const SLUG_DICH_VU_RIENG: Partial<Record<ServiceKey, Record<Locale, string>>> = {
  domestic: { 'vi-vn': 'van-chuyen-noi-dia', 'en-us': 'domestic-transport' },
};

/** Dịch vụ này có trang riêng ở cấp một hay nằm dưới /dich-vu. */
export function coTrangRieng(key: ServiceKey): boolean {
  return SLUG_DICH_VU_RIENG[key] !== undefined;
}

/** Những dịch vụ vẫn nằm trong mục Dịch vụ — dùng để dựng danh sách hiển thị. */
export function dichVuTrongMuc(keys: readonly ServiceKey[]): ServiceKey[] {
  return keys.filter((k) => !coTrangRieng(k));
}

/**
 * Đoạn URL cấp một trả về dịch vụ nào — null nếu đó không phải trang dịch vụ
 * đứng riêng. Route bắt-tất ở cấp một hỏi hàm này sau khi hỏi bảng trang.
 */
export function dichVuRiengTuSlug(slug: string, locale: Locale): ServiceKey | null {
  for (const [key, bang] of Object.entries(SLUG_DICH_VU_RIENG)) {
    if (bang[locale] === slug) return key as ServiceKey;
  }
  return null;
}

/** Mọi (ngôn ngữ, đoạn URL) của những dịch vụ đứng riêng — để prerender. */
function duongDanDichVuRieng(): { locale: Locale; slug: string }[] {
  return LOCALES.flatMap((locale) =>
    Object.values(SLUG_DICH_VU_RIENG).map((bang) => ({ locale, slug: bang[locale] })),
  );
}

/** Resolve a URL segment back to its page key — null if it is not a real page. */
export function pageKeyFromSlug(slug: string, locale: Locale): PageKey | null {
  for (const key of PAGE_KEYS) {
    if (SLUGS[key][locale] === slug) return key;
  }
  return null;
}

/** Absolute-from-root path for a page in a given language. */
export function pathFor(key: PageKey | 'home', locale: Locale): string {
  return key === 'home' ? `/${locale}` : `/${locale}/${slugFor(key, locale)}`;
}

/**
 * The same page in every language, for `alternates.languages`. Built from the
 * slug table, so a page can never advertise an alternate that does not exist.
 */
export function alternatesFor(key: PageKey | 'home'): Record<string, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, pathFor(key, locale)]),
  );
}

/** Flat list of every (locale, slug) pair — feeds generateStaticParams and the sitemap. */
export function allPagePaths(): { locale: Locale; slug: string }[] {
  return [
    ...LOCALES.flatMap((locale) =>
      RENDERED_KEYS.map((key) => ({ locale, slug: slugFor(key, locale) })),
    ),
    // Dịch vụ đứng riêng cũng là trang cấp một, cùng route bắt-tất.
    ...duongDanDichVuRieng(),
  ];
}

/* --------------------------------------------------------------------------
   Service detail pages sit one level below the services page, so their paths
   are built from the same slug table rather than being spelled out again.
   -------------------------------------------------------------------------- */

export function pathForService(key: ServiceKey, locale: Locale): string {
  const rieng = SLUG_DICH_VU_RIENG[key];
  if (rieng) return `/${locale}/${rieng[locale]}`;
  return `/${locale}/${slugFor('services', locale)}/${serviceSlug(key, locale)}`;
}

/**
 * Đường dẫn của một dịch vụ người dùng tự thêm.
 *
 * Tách hàm riêng chứ không nhét thêm tham số vào `pathForService`: chín dịch vụ
 * gốc tra đường dẫn từ bảng trong code, còn dịch vụ tự thêm mang sẵn đoạn URL
 * của nó trong từ điển. Hai nguồn khác nhau, để lẫn vào một hàm thì mỗi chỗ gọi
 * lại phải tự biết mình đang ở nhánh nào.
 */
export function duongDanDichVuThem(slug: string, locale: Locale): string {
  return `/${locale}/${slugFor('services', locale)}/${slug}`;
}

/**
 * Which service page a path is on, or null anywhere else.
 *
 * The quote CTAs in the header and the thumb bar live in the layout, which is
 * handed the locale and nothing else, so the service they should carry has to
 * be read back off the URL.
 */
export function serviceKeyFromPath(pathname: string, locale: Locale): ServiceKey | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== locale) return null;
  // /<locale>/<service slug> — dịch vụ có trang riêng ở cấp một.
  if (parts.length === 2) return dichVuRiengTuSlug(parts[1]!, locale);
  // /<locale>/<services slug>/<service slug>
  if (parts.length !== 3) return null;
  if (parts[1] !== slugFor('services', locale)) return null;
  return serviceKeyFromSlug(parts[2]!, locale);
}

/**
 * The contact path, carrying the service a quote should open with.
 *
 * QuoteForm reads `service` back off the query and preselects it, so somebody
 * who asks for a quote from a service page does not have to say which service
 * they were just reading about.
 */
export function quotePath(locale: Locale, service?: KhoaDichVu | null): string {
  const base = pathFor('contact', locale);
  return service ? `${base}?service=${service}` : base;
}

/** The same service page in every language, for `alternates.languages`. */
export function serviceAlternates(key: ServiceKey): Record<string, string> {
  return Object.fromEntries(LOCALES.map((locale) => [locale, pathForService(key, locale)]));
}

/** Every (locale, section slug, service slug) triple — feeds generateStaticParams. */
export function allServicePaths(): { locale: Locale; slug: string; service: string }[] {
  return LOCALES.flatMap((locale) =>
    dichVuTrongMuc(SERVICE_KEYS).map((key) => ({
      locale,
      slug: slugFor('services', locale),
      service: serviceSlug(key, locale),
    })),
  );
}

/* --------------------------------------------------------------------------
   Article pages sit one level below the blog page, exactly as service pages
   sit below the services page — same URL depth, same route file. Their slugs
   come from the CMS rather than from the table above, so there is nothing to
   look up: a slug is valid if the backend has an article under it.
   -------------------------------------------------------------------------- */

export function pathForArticle(slug: string, locale: Locale): string {
  return `/${locale}/${slugFor('blog', locale)}/${slug}`;
}

/**
 * An article's canonical URL. Deliberately the Vietnamese one whichever locale
 * is rendering: the newsroom holds one copy of each article, so /en-us/blog/x
 * and /vi-vn/tin-tuc/x serve the very same words. Pointing both at one URL
 * says so, where an hreflang pair would claim a translation that does not
 * exist. Give articles a per-language body and this becomes a real alternates
 * map instead.
 */
export function articleCanonical(slug: string): string {
  return pathForArticle(slug, DEFAULT_LOCALE);
}
