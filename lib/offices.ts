import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { phoneDial, phoneDisplay } from '@/lib/representatives';

export type VanPhong = Dictionary['site']['offices'][number];

/**
 * Văn phòng được hiện ra web.
 *
 * `hidden` là công tắc trong CMS, không phải nút xoá: xoá một văn phòng là mất
 * luôn địa chỉ, và bật lại thì phải gõ từ đầu. Đóng cửa tạm một chi nhánh, hay
 * chưa tới ngày khai trương, là những lúc cần giấu mà vẫn giữ.
 *
 * Mọi chỗ in địa chỉ đều đi qua đây, không tự đọc `dict.site.offices`: lọc ở
 * từng chỗ thì sớm muộn có một chỗ quên, và văn phòng đã tắt vẫn lộ ra ở đúng
 * một trang mà không ai nghĩ tới.
 */
export function vanPhongHien(offices: readonly VanPhong[]): VanPhong[] {
  return offices.filter((o) => o.hidden !== '1');
}

/**
 * Văn phòng đứng đầu trong số đang hiện — dùng cho những chỗ chỉ in được MỘT
 * địa chỉ (hai trang pháp lý). Tắt hết thì trả `undefined`, và bên gọi tự lo
 * phần không in gì.
 */
export function vanPhongDau(offices: readonly VanPhong[]): VanPhong | undefined {
  return vanPhongHien(offices)[0];
}

/**
 * Link mở Google Maps tới địa chỉ của văn phòng.
 *
 * Tìm theo CHUỖI địa chỉ chứ không theo toạ độ: CMS chỉ có địa chỉ, và bắt
 * người biên tập đi tra toạ độ cho mỗi chi nhánh là một bước họ sẽ bỏ qua.
 * Dạng `maps/search/?api=1` là đường link công khai của Google — trên điện
 * thoại nó tự mở ứng dụng Maps nếu có cài.
 */
export function linkBanDo(o: Pick<VanPhong, 'street' | 'city'>): string {
  const q = [o.street.trim(), o.city.trim()].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/**
 * Số và email RIÊNG của một văn phòng, đã định dạng — ô nào trống thì không có.
 *
 * Hai ô này để dành cho lúc một chi nhánh có đường dây hay hộp thư của riêng
 * nó; hiện cả công ty dùng chung một hotline và một email. Trống thì KHÔNG rơi
 * về số/email chung: cái chung đã in riêng một chỗ, lặp lại dưới từng văn phòng
 * thì đọc như số của chính văn phòng đó.
 */
export function lienLacRieng(o: Pick<VanPhong, 'phone' | 'email'>): {
  phone: { display: string; href: string } | null;
  email: string | null;
} {
  const so = (o.phone ?? '').trim();
  const mail = (o.email ?? '').trim();
  return {
    phone: so ? { display: phoneDisplay(so), href: `tel:${phoneDial(so)}` } : null,
    email: mail || null,
  };
}

/**
 * Nhãn nhóm văn phòng theo ngôn ngữ trang.
 *
 * Danh sách văn phòng DÙNG CHUNG hai ngôn ngữ (địa chỉ không có bản tiếng Anh,
 * số và email là một — xem localesFor ở BE), nên nhãn lưu một bản tiếng Việt.
 * Bản tiếng Anh dịch hai nhãn chuẩn; nhãn tự đặt khác thì giữ nguyên chữ.
 */
const NHAN_EN: Readonly<Record<string, string>> = {
  'Trụ sở chính': 'Headquarters',
  'Chi nhánh': 'Branch',
};
export function nhanNhom(label: string, locale: Locale): string {
  return locale === 'en-us' ? (NHAN_EN[label.trim()] ?? label) : label;
}
