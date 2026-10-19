/**
 * Một khối có nội dung để con lăn dọc lướt qua TRƯỚC khi trang sang slide sau
 * — hàng thẻ dịch vụ trên trang chủ.
 *
 * Khối đó không tự nghe con lăn dọc. SlidePager là chỗ duy nhất tách luồng sự
 * kiện con lăn thành từng cử chỉ (khoảng lặng, đuôi quán tính của bàn di, cú
 * vuốt mới chen vào đuôi), nên nó hỏi ở đây mỗi khi có cử chỉ mới: khối nào
 * nhận thì cả cử chỉ — đuôi quán tính gồm luôn — là của khối đó; không khối
 * nào nhận thì trang sang slide như thường.
 *
 * Tự nghe thì phải chép lại toàn bộ phép tách cử chỉ ấy, và mỗi lần hai bản
 * lệch nhau là một lỗi: đuôi của cú cuộn vừa đưa trang tới làm hàng thẻ tự
 * chạy, hay cú vuốt chen vào đuôi bị nuốt mất và trang trông như bị kẹt.
 */
export interface WheelScrub {
  /**
   * Một cử chỉ mới theo chiều `dir` (1 là xuống, -1 là lên), mở bằng sự kiện
   * `e`. Trả về true là nhận — chỉ khi con trỏ đang nằm trên khối và khối còn
   * đi được theo chiều đó. Con trỏ ở chỗ khác, hay khối đã ở đầu (hay cuối),
   * thì trả false để trang sang slide.
   */
  start(dir: 1 | -1, e: WheelEvent): boolean;
  /** Từng sự kiện của cử chỉ đã nhận, kể cả sự kiện mở đầu: độ dời dọc (px,
   *  đã cộng dồn các sự kiện nhỏ trước khi cử chỉ được xét), và chính sự kiện
   *  — để biết đó là nấc chuột hay bàn di. */
  move(dy: number, e: WheelEvent): void;
}

const scrubs = new Set<WheelScrub>();

/** Đăng ký một khối; trả về hàm gỡ đăng ký. */
export function addWheelScrub(scrub: WheelScrub): () => void {
  scrubs.add(scrub);
  return () => {
    scrubs.delete(scrub);
  };
}

/** Khối nhận cử chỉ mới theo chiều `dir`, mở bằng sự kiện `e`, nếu có. */
export function takeWheelScrub(dir: 1 | -1, e: WheelEvent): WheelScrub | null {
  for (const scrub of scrubs) if (scrub.start(dir, e)) return scrub;
  return null;
}
