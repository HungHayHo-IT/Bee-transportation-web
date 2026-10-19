import type { Dictionary } from './i18n';
import type { Locale } from './i18n/config';
import { pathFor, pathForService, type PageKey } from './routes';

import type { ServiceKey } from './services';

/**
 * What the header, its services menu and the footer list, from one place.
 *
 * The header reads: Services ▾ · Road transport · International transport.
 *
 * * "Road transport" is the domestic service lifted out of the menu and put
 *   in the bar on its own — it is the line most visitors come for.
 * * "International transport" is the cross-border page.
 * * Warehousing, which used to stand in the bar, goes into the services menu
 *   in the place the domestic service left: the two swap.
 *
 * Labels are never written here. A service is named by
 * `services.items.<key>.name` and a page by `nav.<key>`, both in the
 * dictionaries and both editable from the CMS — so renaming a service in the
 * CMS renames it in the bar, the menu, the footer and on its card at once.
 */
export type NavEntry =
  | { readonly kind: 'service'; readonly key: ServiceKey }
  | { readonly kind: 'page'; readonly key: PageKey };

/** The service that stands in the header on its own, out of the menu. */
export const HEADER_SERVICE: ServiceKey = 'domestic';
/** The page that takes that service's place in the services menu. */
export const MENU_PAGE: PageKey = 'warehousing';

/** The links after the services menu in the header, in order. */
export const HEADER_LINKS: readonly NavEntry[] = [
  { kind: 'service', key: HEADER_SERVICE },
  { kind: 'page', key: 'crossborder' },
];

/*
 * Mục xổ xuống của "Dịch vụ" KHÔNG dựng ở đây nữa — xem danhSachDichVu trong
 * lib/service-listing.ts.
 *
 * Lý do: cùng một danh sách đó còn dựng cột Dịch vụ ở chân trang và hàng thẻ
 * trên trang chủ, mà hàng thẻ cần thêm ảnh và gạch đầu dòng của từng mục. Để
 * hai chỗ cùng trả lời "mục Dịch vụ gồm những gì" thì sớm muộn chúng lệch
 * nhau, và không có gì báo.
 *
 * Cú hoán đổi vẫn giữ nguyên ý: Vận chuyển nội địa đứng riêng trên thanh (nó
 * đã lên trang riêng cấp một), Kho bãi vào đúng chỗ nó để lại trong menu.
 */

export function entryHref(entry: NavEntry, locale: Locale): string {
  return entry.kind === 'service' ? pathForService(entry.key, locale) : pathFor(entry.key, locale);
}

export function entryLabel(entry: NavEntry, dict: Dictionary): string {
  return entry.kind === 'service' ? dict.services.items[entry.key].name : dict.nav[entry.key];
}

export function entryId(entry: NavEntry): string {
  return `${entry.kind}:${entry.key}`;
}
