/**
 * Trang có đang nằm trong khung sửa của màn CMS hay không.
 *
 * Hai điều kiện, và phải đủ cả hai:
 *
 * * `?cms-edit=1` — chỉ màn CMS mới gắn tham số này vào khung xem trước.
 * * Nằm trong khung (`window.parent !== window`) — nếu ai đó gửi nguyên cái
 *   link kèm tham số cho khách thì mở ra vẫn là trang bình thường.
 *
 * Chỉ gọi được ở trình duyệt. Trên máy chủ luôn trả về false, và đó là chủ ý:
 * đọc tham số URL lúc dựng trang là đẩy cả 44 trang tĩnh sang render động.
 */
export function dangSuaTaiCho(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.parent === window) return false;
  return new URLSearchParams(window.location.search).get('cms-edit') === '1';
}

/**
 * Cửa sổ màn CMS đang nói chuyện với trang này, hoặc null nếu không có.
 *
 * Hai cách trang được mở từ màn CMS:
 *
 * * Trong khung xem trước — cửa sổ CMS là `window.parent`.
 * * Ở TAB MỚI qua nút "Mở trang ở tab mới (kèm thay đổi chưa lưu)" — cửa sổ
 *   CMS là `window.opener`. Chỉ tính khi có `?cms-preview=1`: một trang lạ mở
 *   landing không kèm tham số thì vẫn là trang thường.
 */
export function cuaSoCms(): Window | null {
  if (typeof window === 'undefined') return null;
  if (window.parent !== window) return window.parent;
  const coThamSo = new URLSearchParams(window.location.search).get('cms-preview') === '1';
  return coThamSo && window.opener ? (window.opener as Window) : null;
}

/**
 * Trang có đang ở chế độ XEM TRƯỚC bản nháp hay không.
 *
 * Khác chế độ sửa ở chỗ: không viền ô, không gõ được, và KHÔNG tắt hiệu ứng
 * động. Chủ ý — đây là chỗ để xem trang sẽ ra sao với khách thật, nên hero
 * phải chạy video, thẻ dịch vụ phải lật, cuộn phải theo từng màn như thường.
 *
 * Vì `dangSuaTaiCho` không nhận tham số này, mọi khối đã tắt hiệu ứng ở chế độ
 * sửa (Hero, SlidePager, ProcessSlide, WarehouseTypes, Counter) tự động chạy
 * lại bình thường — không phải sửa thêm chỗ nào.
 */
export function dangXemTruoc(): boolean {
  if (cuaSoCms() === null) return false;
  return new URLSearchParams(window.location.search).get('cms-preview') === '1';
}

const ADMIN_ORIGINS = (process.env.NEXT_PUBLIC_CMS_ADMIN_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

/**
 * Tin nhắn này có đến từ màn CMS thật không.
 *
 * Bắt buộc ở chế độ tab mới: không có frame-ancestors nào lọc `window.opener`,
 * nên thiếu bước này thì bất kỳ trang nào mở landing kèm `?cms-preview=1` cũng
 * đắp được chữ giả lên tên miền thật — một trang lừa đảo hoàn hảo.
 */
export function laAdminCms(origin: string): boolean {
  return ADMIN_ORIGINS.includes(origin);
}

/** Dấu đặt trên <html> để CSS tắt các hiệu ứng động khi đang sửa. */
export const DAU_CMS = 'data-cms-edit';
