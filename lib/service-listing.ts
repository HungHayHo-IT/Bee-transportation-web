import type { Dictionary } from './i18n';
import type { Locale } from './i18n/config';
import { dichVuTrongMuc, duongDanDichVuThem, pathFor, pathForService } from './routes';
import { SERVICE_KEYS, type ServiceKey } from './services';

/**
 * Mục Dịch vụ gồm những gì — một nguồn duy nhất cho ba chỗ hiển thị.
 *
 * Ba chỗ đó là: menu xổ xuống trên thanh điều hướng, cột Dịch vụ ở chân trang,
 * và hàng thẻ trên trang chủ. Trước đây mỗi chỗ tự gọi `thuTuDichVu` rồi tự
 * dựng đường dẫn, nên "mục Dịch vụ gồm những gì" được trả lời ba lần ở ba
 * file — và ba câu trả lời đó lệch nhau ngay lần đầu mục này thay đổi.
 *
 * Hai điểm khác với danh sách chín dịch vụ thuần:
 *
 * * BỎ dịch vụ đã có trang riêng ở cấp một (Vận chuyển nội địa). Nó vẫn là
 *   một dịch vụ, nhưng không còn nằm trong mục này nữa.
 * * THÊM Kho bãi. Kho bãi có trang riêng chứ không dựng từ khuôn trang dịch
 *   vụ, nhưng với người đọc nó là một thứ công ty làm, và chỗ người ta đi tìm
 *   nó là mục Dịch vụ.
 */
export interface MucDichVu {
  /** Khoá dịch vụ, hoặc 'warehousing' cho trang Kho bãi. */
  key: string;
  name: string;
  href: string;
  /** Gạch đầu dòng in ở mặt sau tấm thẻ trên trang chủ. */
  points: readonly string[];
  /** Ô ảnh trong IMAGE_SLOTS — thẻ trên trang chủ vẽ bằng ô này. */
  anh: string;
}

/** Khoá của mục Kho bãi trong danh sách. Không phải một ServiceKey. */
export const KHO_BAI = 'warehousing';

/**
 * Thứ tự các mục trong mục Dịch vụ, do CMS quyết định.
 *
 * Đọc CHUNG ô `services.order` với `thuTuDichVu`, không mở ô thứ hai. Cùng một
 * danh sách khoá, hai bên đọc ra hai thứ khác nhau vì mỗi bên bỏ đi cái mình
 * không hiểu: `thuTuDichVu` bỏ 'warehousing' (nó không phải dịch vụ với form
 * báo giá hay với backend), còn ở đây bỏ dịch vụ đã có trang riêng. Hai ô thứ
 * tự riêng thì sớm muộn cũng lệch nhau, và không có gì báo.
 *
 * Dọn sạch đầu vào y như `thuTuDichVu`: bỏ khoá lạ, bỏ khoá lặp, và BỔ SUNG
 * khoá còn thiếu vào cuối — thiếu luật cuối thì thêm một mục mới vào code mà
 * thứ tự đã lưu từ trước không nhắc tới nó, nó sẽ không bao giờ hiện ra.
 */
function thuTuMuc(dict: Dictionary): string[] {
  /* Dịch vụ người dùng tự thêm cũng là mục hợp lệ. Nhận ra chúng bằng chính từ
     điển — khoá nào có trong `items` mà không phải một trong chín khoá gốc thì
     là khoá tự thêm — chứ không hỏi lại backend: từ điển đã được ghép sẵn ở
     getContent, hỏi thêm một lần nữa là hai nguồn cho cùng một câu hỏi. */
  const tuThem = Object.keys(dict.services.items).filter(
    (k) => !(SERVICE_KEYS as readonly string[]).includes(k),
  );
  const hopLe = [...dichVuTrongMuc(SERVICE_KEYS), KHO_BAI, ...tuThem];
  const khai = dict.services.order;
  const ra: string[] = [];
  const daCo = new Set<string>();

  if (Array.isArray(khai)) {
    for (const k of khai) {
      if (typeof k !== 'string' || !hopLe.includes(k) || daCo.has(k)) continue;
      daCo.add(k);
      ra.push(k);
    }
  }
  for (const k of hopLe) if (!daCo.has(k)) ra.push(k);
  return ra;
}

export function danhSachDichVu(dict: Dictionary, locale: Locale): MucDichVu[] {
  return thuTuMuc(dict).map((key) =>
    key === KHO_BAI
      ? {
          key,
          name: dict.nav.warehousing,
          href: pathFor('warehousing', locale),
          // Tên ba loại kho thay cho gạch đầu dòng: đó đã là câu trả lời ngắn
          // nhất cho "kho bãi ở đây gồm những gì", và nó tự chạy theo CMS.
          points: dict.warehousing.warehouses.map((k) => k.name),
          // Dùng lại chính ảnh đầu trang Kho bãi, không mở thêm ô ảnh mới:
          // thêm ô nghĩa là người sửa phải nhớ thay hai chỗ cho một tấm ảnh.
          anh: 'warehouseBg',
        }
      : (() => {
          const muc = dict.services.items[key];
          return {
            key,
            name: muc.name,
            // Dịch vụ tự thêm mang sẵn đoạn URL của nó trong từ điển; chín dịch
            // vụ gốc tra bảng đường dẫn trong code.
            href: muc.slug
              ? duongDanDichVuThem(muc.slug, locale)
              : pathForService(key as ServiceKey, locale),
            points: muc.points ?? [],
            anh: `service.${key}`,
          };
        })(),
  );
}

/**
 * Khoá CMS của CHÍNH cái tên mỗi mục — để màn admin sửa tên ngay tại chỗ.
 *
 * Tên Kho bãi nằm ở `nav.warehousing` chứ không nằm trong `services.items`:
 * nó là tên của một trang, và đổi ở đây là đổi luôn cả trên thanh điều hướng
 * lẫn ở chân trang. Đó là điều đúng — ba chỗ đó đang gọi cùng một thứ.
 */
export function khoaTenMuc(key: string): string {
  return key === KHO_BAI ? 'nav.warehousing' : `services.items.${key}.name`;
}

/** Mục này ứng với trang nội dung nào bên CMS. */
export function khoaTrangMuc(key: string): string {
  return key === KHO_BAI ? KHO_BAI : `service.${key}`;
}
