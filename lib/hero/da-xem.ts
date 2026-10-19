/**
 * Người này đã xem hết hiệu ứng hero chưa.
 *
 * Xem xong một lần rồi thì lần sau vào thẳng khung nghỉ: không tải 3,9 MB
 * footage, không chạy lại phim. Phim là để gây ấn tượng lần đầu; từ lần thứ
 * hai nó chỉ còn là một quãng chờ giữa người ta và việc họ vào đây để làm.
 *
 * `localStorage` chứ không phải cookie: đây là tiện nghi của riêng máy đó,
 * không cần gửi lên server và không ảnh hưởng tới bản HTML tĩnh phát từ biên.
 * Mọi lần đọc/ghi đều bọc try/catch — cửa sổ ẩn danh và trình duyệt chặn lưu
 * trữ đều ném ở đây, và một hero không chạy được vì thế thì tệ hơn hẳn việc
 * xem lại phim.
 */
const KHOA = 'bee-hero-da-xem';

export function daXemHero(): boolean {
  try {
    return localStorage.getItem(KHOA) === '1';
  } catch {
    return false;
  }
}

export function ghiNhoDaXem(): void {
  try {
    localStorage.setItem(KHOA, '1');
  } catch {
    /* không lưu được thì lần sau xem lại, không sao */
  }
}
