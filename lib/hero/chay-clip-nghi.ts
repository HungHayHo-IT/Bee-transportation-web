/**
 * Chạy clip nền của khung nghỉ, KHÔNG nhờ tới `play()`.
 *
 * Đã thử hai lần bằng `play()` và cả hai lần clip đứng im. `play()` là thứ
 * trình duyệt có quyền từ chối — chế độ tiết kiệm pin, cài đặt chặn phương
 * tiện, chính sách tự chạy — và khi bị từ chối thì không có cách nào biết
 * ngoài việc nhìn vào màn hình.
 *
 * Nên bỏ hẳn nó. Tự đẩy `currentTime` mỗi khung hình là đúng cách cỗ máy đã
 * dựng cả bộ phim hero từ đầu tới giờ: đặt `currentTime` không phải là PHÁT,
 * nên không xin phép ai cả, và nó đã chạy được suốt bốn clip trước mắt người
 * xem. Thứ duy nhất còn cần xin là DỮ LIỆU, mà `load()` thì không bị chặn.
 *
 * Trả về hàm dừng — gọi khi gỡ, nếu không vòng lặp sống lâu hơn trang.
 */
export function chayClipNghi(v: HTMLVideoElement): () => void {
  v.muted = true;
  if (v.preload !== 'auto') {
    v.preload = 'auto';
    v.load();
  }
  // Vẫn thử play(): được thì trình duyệt giải mã mượt hơn hẳn việc tua tay.
  // Không được cũng không sao, vòng lặp dưới đây gánh.
  const hua = v.play();
  if (hua && hua.catch) hua.catch(() => {});

  let id = 0;
  let truoc = 0;
  const buoc = (nay: number): void => {
    id = requestAnimationFrame(buoc);
    const truocDo = truoc;
    truoc = nay;
    // play() ăn rồi thì để nó chạy, đừng giật con trỏ thời gian của nó.
    if (!v.paused || truocDo === 0 || !v.duration) return;
    const giay = Math.min((nay - truocDo) / 1000, 0.1);
    const moi = v.currentTime + giay;
    v.currentTime = moi >= v.duration ? 0 : moi;
  };
  id = requestAnimationFrame(buoc);
  return () => cancelAnimationFrame(id);
}
