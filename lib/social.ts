/**
 * Các kênh mạng xã hội hiện ở chân trang.
 *
 * Danh sách nằm trong code, ĐỊA CHỈ nằm ở CMS. Lý do chia đôi như vậy: mỗi
 * kênh cần một biểu tượng riêng, mà biểu tượng là hình vẽ trong mã nguồn chứ
 * không phải thứ gõ vào được. Thêm một mạng mới vẫn phải sửa code; còn đổi
 * địa chỉ trang, hay tắt bớt một kênh, thì đội nội dung tự làm.
 *
 * Khoá ở đây trùng với tên trường trong `dict.social`.
 */
export const SOCIAL_KEYS = ['facebook', 'zalo', 'youtube', 'linkedin', 'tiktok'] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

/**
 * Tên kênh, dùng cho `aria-label` và tiêu đề khi rê chuột.
 *
 * Không đưa vào CMS: đây là tên thương hiệu của bên thứ ba, không phải nội
 * dung của trang này, và dịch nó ra thì trình đọc màn hình đọc sai tên.
 */
export const SOCIAL_LABELS: Record<SocialKey, string> = {
  facebook: 'Facebook',
  zalo: 'Zalo',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
};

/**
 * Địa chỉ dùng được, hoặc null.
 *
 * Người sửa rất dễ gõ 'facebook.com/beeops' thiếu 'https://'. Trình duyệt hiểu
 * chuỗi đó là đường dẫn TƯƠNG ĐỐI, nên cái nút sẽ dẫn về
 * beetransportation.vn/facebook.com/beeops — một trang 404, và không có gì báo
 * lỗi ở đâu cả. Thà không hiện cái nút đó còn hơn.
 *
 * Chỉ nhận http và https: `javascript:` trong một ô ai cũng gõ được là một
 * đường chạy mã ngay trên trang.
 */
/**
 * Những kênh đang TẮT, đọc từ ô `social.off`.
 *
 * Vì sao cần ô này thay vì "xoá trống địa chỉ là tắt": xoá trống thì mất luôn
 * địa chỉ, bật lại phải đi tìm và gõ lại. Tắt tạm một kênh — trang đang sửa,
 * fanpage đang khoá — là việc thường, còn nhớ hộ cái địa chỉ là việc của máy.
 *
 * Lưu thành một chuỗi khoá cách nhau bằng dấu cách, không phải năm ô bật/tắt
 * riêng: năm ô thì màn CMS hiện ra năm dòng '1/0' không ai đọc được, còn ở đây
 * cả cụm nằm sau một hàng công tắc.
 */
export function kenhDangTat(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? '')
      .split(/[\s,]+/)
      .map((x) => x.trim())
      .filter(Boolean),
  );
}

/** Ngược lại: từ tập khoá đang tắt về đúng chuỗi lưu trong CMS. */
export function chuoiKenhTat(tat: Iterable<string>): string {
  return SOCIAL_KEYS.filter((k) => [...tat].includes(k)).join(' ');
}

export function diaChiMangXaHoi(raw: string | undefined): string | null {
  const t = (raw ?? '').trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Hình vẽ từng biểu tượng, đường `path` trong khung 24x24.
 *
 * Vẽ một màu và dùng `currentColor`, nên chúng ăn theo màu chữ của chân trang
 * và không phải sửa gì khi đổi nền.
 */
export const SOCIAL_ICONS: Record<SocialKey, string> = {
  facebook:
    'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z',
  // Bong bong chat voi chu Z khoet rong o giua — dang rut gon mot mau cua
  // dau Zalo, va la dang duy nhat con doc duoc o 20px. Lo chu Z la mot subpath
  // NGUOC CHIEU voi bong bong: luat to mac dinh (nonzero) coi phan chong nhau
  // giua hai chieu nguoc nhau la rong, nen khong can fill-rule rieng.
  zalo:
    'M8 3H16A5 5 0 0 1 21 8V13A5 5 0 0 1 16 18H12.5L6.8 21.6L7.6 17.9A5 5 0 0 1 3 13V8A5 5 0 0 1 8 3Z' +
    'M8.8 9.1H12.8L8.8 12.9V14.4H15.2V12.9H11.2L15.2 9.1V7.6H8.8Z',
  youtube:
    'M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z',
  linkedin:
    'M20.45 2H3.55A1.54 1.54 0 0 0 2 3.52v16.96A1.54 1.54 0 0 0 3.55 22h16.9A1.54 1.54 0 0 0 22 20.48V3.52A1.54 1.54 0 0 0 20.45 2ZM8.04 18.34H5.11V9.5h2.93v8.84ZM6.58 8.28a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Zm12.32 10.06h-2.93v-4.3c0-1.02-.02-2.35-1.43-2.35-1.44 0-1.66 1.12-1.66 2.28v4.37H9.95V9.5h2.81v1.21h.04a3.08 3.08 0 0 1 2.77-1.52c2.97 0 3.52 1.95 3.52 4.5v4.65Z',
  tiktok:
    'M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.77-2.45v-3.14a5.68 5.68 0 1 0 4.86 5.62V9.01a7.35 7.35 0 0 0 4.29 1.38V7.3a4.29 4.29 0 0 1-3.23-1.48Z',
};
