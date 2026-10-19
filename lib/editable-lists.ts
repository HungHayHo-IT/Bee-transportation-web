/**
 * Những danh sách CHỨA ĐỐI TƯỢNG mà CMS được phép thêm, bớt và đổi thứ tự.
 *
 * Cơ chế danh sách của CMS vốn chỉ làm việc với mảng TOÀN CHUỖI — dải thẻ,
 * gạch đầu dòng, con số. Với mảng chứa đối tượng thì một mục gồm nhiều ô, nên
 * phải nói rõ mục đó có những ô nào; đoán theo phần tử đầu tiên là đủ để đọc,
 * nhưng không đủ để CHẶN: một mục mới gõ thiếu ô sẽ lọt vào từ điển và làm
 * trang ném lỗi ở đúng chỗ đọc ô thiếu đó.
 *
 * KHAI TAY chứ không mở cho mọi mảng đối tượng, và đó là điểm chính:
 *
 * * Nhiều mảng đối tượng trong từ điển có ràng buộc nằm ở component chứ không
 *   nằm trong dữ liệu — bốn mốc chương hero chạy theo bốn quãng video, ba số
 *   liệu vẽ thành một hàng cố định trên ảnh chia sẻ. Mở hết một lượt là mời
 *   người biên tập thêm vào những chỗ không nhận thêm.
 * * Mở thêm một danh sách sau này chỉ là thêm một dòng ở đây, và lúc đó người
 *   thêm buộc phải nhìn lại component xem nó có chịu được số lượng khác không.
 */
export interface ObjectList {
  /** Tiền tố khoá của cả danh sách, ví dụ 'site.offices'. */
  prefix: string;
  /** Các ô của MỘT mục, đúng tên và đúng thứ tự hiện ra khi sửa. */
  fields: readonly string[];
  /**
   * Ô nào là CÔNG TẮC bật/tắt chứ không phải ô gõ chữ.
   *
   * Vẫn là chuỗi trong dữ liệu ('1' = bật, rỗng = tắt) vì cả cơ chế lớp phủ
   * chỉ biết chuỗi; cái khác là màn CMS vẽ nó thành một công tắc, và luật "mục
   * trống thì bỏ" không tính tới nó — gạt công tắc mà chưa gõ gì thì mục đó
   * vẫn là mục trống.
   */
  toggles?: readonly string[];
}

export const OBJECT_LISTS: readonly ObjectList[] = [
  // Văn phòng công ty. Mọi chỗ đọc danh sách này đều chịu được danh sách rỗng,
  // nên thêm bớt bao nhiêu cũng được. `hidden` để giấu một văn phòng khỏi web
  // mà KHÔNG phải xoá nó đi — xoá là mất địa chỉ, gõ lại từ đầu khi cần bật.
  {
    prefix: 'site.offices',
    // `phone` de rong thi chan trang lay so hotline chung — xem FooterOffices.
    fields: ['label', 'street', 'city', 'phone', 'email', 'hidden'],
    toggles: ['hidden'],
  },

  // Dieu khoan cua hai trang phap ly. `LegalDocument` danh so theo VI TRI va
  // gom nhom theo `group`, nen them bot bao nhieu dieu cung dung.
  //
  // `id` PHAI co trong danh sach o nay du khong ai sua no: lop phu dung lai
  // tung muc CHI tu nhung o duoc khai (xem overrides.ts), o nao khong khai la
  // mat han sau lan luu dau tien. Rot mat `id` la rot mo neo
  // '#xoa-tai-khoan' — dia chi ma Google Play va App Store doi phai tro dung
  // vao huong dan xoa tai khoan, khong phai dau trang.
  {
    prefix: 'legal.privacy.sections',
    fields: ['name', 'body', 'id'],
  },
  // `group` de rong = dieu nay nam tiep trong nhom dang mo. Chi dien khi muon
  // MO MOT NHOM MOI bat dau tu dieu do.
  {
    prefix: 'legal.terms.sections',
    fields: ['group', 'name', 'body'],
  },

  // Câu hỏi thường gặp ở trang chủ. Component chỉ map qua mảng nên bao nhiêu
  // câu cũng được, kể cả rỗng (khối tự ẩn).
  {
    prefix: 'homeFaq.items',
    fields: ['q', 'a'],
  },
];

/** Danh sách đối tượng ứng với tiền tố này, nếu có khai. */
export function danhSachDoiTuong(prefix: string): ObjectList | undefined {
  return OBJECT_LISTS.find((d) => d.prefix === prefix);
}
