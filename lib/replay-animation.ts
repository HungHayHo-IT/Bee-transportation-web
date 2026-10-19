/**
 * Chạy lại hiệu ứng CSS của các phần tử, không dựng lại phần tử.
 *
 * Đổi `key` cũng chạy lại được hiệu ứng, nhưng là bằng cách gỡ phần tử cũ khỏi
 * trang. Chrome dính mỗi lượt con lăn vào phần tử nằm dưới con trỏ lúc bắt
 * đầu: phần tử đó bị gỡ thì các sự kiện sau vẫn gửi vào nó, không nổi lên tới
 * trang, và trang đứng im cho tới khi di chuột đi chỗ khác.
 *
 * Người bật giảm chuyển động có `animation:none` — không có gì để chạy lại.
 */
export function replayAnimations(...els: (Element | null)[]): void {
  for (const el of els) {
    for (const a of el?.getAnimations() ?? []) {
      a.cancel();
      a.play();
    }
  }
}
