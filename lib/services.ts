import type { Locale } from './i18n/config';

/**
 * The nine service lines, each with its own page under the services section:
 * `/vi-vn/dich-vu/van-chuyen-noi-dia`, `/en-us/services/domestic-transport`.
 *
 * Keys are stable and ordering is the order they are numbered in — the cards
 * are labelled 01–09 and a quotation refers to them that way, so the sequence
 * is part of the content, not a presentation detail.
 */
export const SERVICE_KEYS = [
  'consulting',
  'domestic',
  'multimodal',
  'project',
  'lifting',
  'packing',
  'crossborder',
  'leasing',
  'customs',
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];

/**
 * Khoá của một dịch vụ BẤT KỲ trên trang — chín khoá gốc, hoặc khoá của dịch vụ
 * người dùng tự thêm (xem lib/services-them.ts).
 *
 * Viết `string & {}` thay vì `string` để trình soạn thảo vẫn gợi ý chín khoá
 * gốc: `ServiceKey | string` bị TypeScript rút gọn thành `string` và mất sạch
 * gợi ý.
 */
export type KhoaDichVu = ServiceKey | (string & {});

const SERVICE_SLUGS: Record<ServiceKey, Record<Locale, string>> = {
  consulting: { 'vi-vn': 'tu-van-giai-phap', 'en-us': 'transport-consulting' },
  domestic: { 'vi-vn': 'van-chuyen-noi-dia', 'en-us': 'domestic-transport' },
  multimodal: { 'vi-vn': 'da-phuong-thuc', 'en-us': 'multimodal-transport' },
  project: { 'vi-vn': 'hang-sieu-truong-sieu-trong', 'en-us': 'project-heavy-lift' },
  lifting: { 'vi-vn': 'nang-ha-di-doi', 'en-us': 'lifting-relocation' },
  packing: { 'vi-vn': 'dong-kien-dong-goi', 'en-us': 'crating-packing' },
  crossborder: { 'vi-vn': 'hang-qua-canh', 'en-us': 'transit-cross-border' },
  leasing: { 'vi-vn': 'cho-thue-thiet-bi', 'en-us': 'equipment-leasing' },
  customs: { 'vi-vn': 'khai-hai-quan', 'en-us': 'customs-clearance' },
};

export function serviceSlug(key: ServiceKey, locale: Locale): string {
  return SERVICE_SLUGS[key][locale];
}

/** Resolve a URL segment back to its service key — null if it is not one. */
export function serviceKeyFromSlug(slug: string, locale: Locale): ServiceKey | null {
  for (const key of SERVICE_KEYS) {
    if (SERVICE_SLUGS[key][locale] === slug) return key;
  }
  return null;
}

/** Two-digit label, matching the numbering on the service cards. */
export function serviceNumber(key: ServiceKey): string {
  return String(SERVICE_KEYS.indexOf(key) + 1).padStart(2, '0');
}
