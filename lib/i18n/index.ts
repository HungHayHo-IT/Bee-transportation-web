import { en } from './dictionaries/en';
import { vi } from './dictionaries/vi';
import type { Locale } from './config';
import type { Dictionary } from './types';
import { applyOverrides, fetchOverrides } from './overrides';
import { fetchDichVuThem, ghepDichVuThem } from '../services-them';

/**
 * Dictionaries are plain modules, not dynamic imports: the whole site
 * prerenders, so there is no request-time cost to avoid, and a static import
 * keeps `getDictionary` synchronous — which in turn keeps every page component
 * that reads copy free of an extra await.
 */
const DICTIONARIES: Record<Locale, Dictionary> = {
  'vi-vn': vi,
  'en-us': en,
};

/**
 * Bản mặc định, biên dịch sẵn. Đồng bộ, không chạm mạng.
 *
 * Dùng cho những chỗ KHÔNG được phép chờ hay hỏng: thẻ OG dựng trong một hàm
 * render ảnh, và bản dự phòng khi không lấy được lớp phủ.
 */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * Bản đang chạy: mặc định trong code, dán đè lớp phủ do CMS ghi.
 *
 * Đây là hàm mọi trang nên dùng. Lấy lớp phủ hỏng thì nó trả đúng bản mặc
 * định — xem fetchOverrides — nên không chỗ gọi nào phải tự lo đường lỗi.
 */
/**
 * Bản mặc định CỘNG dịch vụ người dùng tự thêm, chưa dán lớp phủ CMS.
 *
 * Màn quản trị cần đúng bản này để biết ô nào đã bị sửa và để nút Khôi phục có
 * chỗ quay về — kể cả với dịch vụ mới, vốn không có dòng nào trong code.
 */
export async function getBaseContent(locale: Locale): Promise<Dictionary> {
  return tieuDeRieng(ghepDichVuThem(DICTIONARIES[locale], await fetchDichVuThem(), locale));
}

/**
 * Mỗi dịch vụ một bản tiêu đề khối riêng, mặc định bằng tiêu đề chung.
 *
 * Điền vào BẢN MẶC ĐỊNH chứ không lúc đọc: nhờ vậy màn CMS thấy
 * `services.items.<dịch vụ>.problemsHeading` như mọi ô khác của trang đó, và
 * sửa nó chỉ đổi đúng một trang.
 */
function tieuDeRieng(d: Dictionary): Dictionary {
  const s = d.services;
  const items = Object.fromEntries(
    Object.entries(s.items).map(([k, e]) => [k, {
      ...e,
      problemsHeading: e.problemsHeading ?? s.problemsHeading,
      approachHeading: e.approachHeading ?? s.approachHeading,
      scopeHeading: e.scopeHeading ?? s.scopeHeading,
      faqHeading: e.faqHeading ?? s.faqHeading,
    }]),
  ) as Dictionary['services']['items'];
  return { ...d, services: { ...s, items } };
}

/**
 * Bản đang chạy: mặc định trong code, cộng dịch vụ tự thêm, dán đè lớp phủ CMS.
 *
 * Đây là hàm mọi trang nên dùng. Lấy lớp phủ hỏng thì nó trả đúng bản mặc
 * định — xem fetchOverrides — nên không chỗ gọi nào phải tự lo đường lỗi.
 */
export async function getContent(locale: Locale): Promise<Dictionary> {
  const [overrides, base] = await Promise.all([fetchOverrides(locale), getBaseContent(locale)]);
  return applyOverrides(base, overrides);
}

export type { Dictionary } from './types';
export * from './config';
