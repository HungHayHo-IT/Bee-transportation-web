import type { Dictionary } from './i18n';
import { SERVICE_KEYS, type ServiceKey } from './services';

/**
 * Thứ tự chín dịch vụ, do CMS quyết định.
 *
 * Trước đây thứ tự nằm cứng trong SERVICE_KEYS. Nó là thứ người đọc nhìn thấy
 * — thẻ trên trang chủ, mục xổ xuống ở thanh điều hướng, cột dịch vụ ở chân
 * trang — nên đổi nó đáng lẽ không cần lập trình viên.
 *
 * Bản trong code vẫn là mặc định. Ô `services.order` của CMS chỉ ghi đè.
 *
 * DỌN SẠCH đầu vào, vì đây là danh sách người ta gõ được và một phần tử lạ
 * không được phép làm hỏng trang:
 *
 * * Bỏ khoá không có thật — dịch vụ bị xoá khỏi code mà thứ tự cũ còn nhắc.
 * * Bỏ khoá lặp — nếu không thì một dịch vụ hiện hai lần.
 * * BỔ SUNG khoá còn thiếu vào cuối. Đây là luật quan trọng nhất: thêm dịch
 *   vụ thứ mười trong code mà thứ tự đã lưu từ trước không nhắc tới nó, thì
 *   thiếu luật này nó sẽ không bao giờ hiện ra — và không có gì báo lỗi.
 */
export function thuTuDichVu(dict: Dictionary): readonly ServiceKey[] {
  const khai = dict.services.order;
  if (!Array.isArray(khai)) return SERVICE_KEYS;

  const hopLe = new Set<string>(SERVICE_KEYS);
  const ra: ServiceKey[] = [];
  const daCo = new Set<string>();
  for (const k of khai) {
    if (typeof k !== 'string' || !hopLe.has(k) || daCo.has(k)) continue;
    daCo.add(k);
    ra.push(k as ServiceKey);
  }
  for (const k of SERVICE_KEYS) if (!daCo.has(k)) ra.push(k);
  return ra;
}
