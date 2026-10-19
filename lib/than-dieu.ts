/**
 * Thân của một điều khoản: từ MỘT CHUỖI ra các khối để dựng.
 *
 * Tách khỏi `legal.tsx` vì có HAI nơi dựng cùng một chuỗi đó: trang thật dựng
 * bằng JSX, còn lớp phủ sửa nội dung (`CmsEditor`) dựng lại bằng DOM mỗi khi
 * người biên tập gõ, để khung xem trước đổi theo ngay chứ không phải bấm Lưu.
 * Hai bên tự phân tích lấy thì chỉ cần một bên hiểu khác là bản xem trước nói
 * dối về trang sắp lên.
 *
 * Giữ `body` là một chuỗi chứ không đổi sang mảng đối tượng: từ điển này do
 * người viết nội dung sửa, và một chuỗi có xuống dòng thì dễ sửa hơn một cấu
 * trúc lồng nhau.
 */

/** Một khối trong thân điều: đoạn văn, hoặc danh sách gạch đầu dòng. */
export interface KhoiThan {
  gach: boolean;
  dong: string[];
}

/**
 * Gom theo DÒNG chứ không theo khối: một câu dẫn và danh sách dưới nó nằm
 * chung một khối, không có dòng trống ngăn cách. Đòi cả khối phải toàn gạch
 * đầu dòng thì danh sách đó ra một đoạn văn dính đầy dấu gạch.
 */
export function phanTichThan(body: string): KhoiThan[] {
  const manh: KhoiThan[] = [];
  for (const khoi of body.split('\n\n')) {
    for (const d of khoi.split('\n')) {
      const gach = d.startsWith('- ');
      const cuoi = manh[manh.length - 1];
      if (cuoi && cuoi.gach === gach) cuoi.dong.push(d);
      else manh.push({ gach, dong: [d] });
    }
    // Đoạn văn kế tiếp bắt đầu một thẻ <p> mới, không nối vào đoạn trước.
    manh.push({ gach: false, dong: [] });
  }
  return manh.filter((m) => m.dong.length > 0);
}

/**
 * `**in đậm**` -> các mảnh xen kẽ. Tách theo dấu `**` rồi lấy xen kẽ: phần lẻ
 * là chữ thường, phần chẵn là chữ đậm. Đủ cho mục đích ở đây và không kéo theo
 * một bộ đọc markdown cho hai trang văn bản.
 */
export function chiaInDam(text: string): { dam: boolean; chu: string }[] {
  return text.split('**').map((chu, i) => ({ dam: i % 2 === 1, chu }));
}
