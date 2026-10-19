import { phoneDial, phoneDisplay, type Representative } from '@/lib/representatives';

function initials(fullName: string): string {
  const words = fullName.trim().split(/\s+/u).slice(-2);
  return words.map((w) => w[0] ?? '').join('').toLocaleUpperCase();
}

/**
 * Một thẻ người đại diện. Thuần hiển thị, không state — nhờ vậy khối tự cập
 * nhật dựng lại danh sách mà không phải dựng lại cách vẽ một thẻ.
 */
export function TeamCard({ r }: { r: Representative }) {
  return (
    <li className="team__card">
      {/* Ảnh nằm TRÊN trong một khung nền sáng bo góc, thông tin nằm dưới: ảnh
          chân dung là thứ đầu tiên người ta nhận ra, còn tên và cách liên hệ là
          thứ đọc sau khi đã dừng lại ở một khuôn mặt.

          `aria-hidden` vì tên đứng ngay dưới: đọc ảnh lên nữa là đọc cùng một
          người hai lần. Dùng <img> thường chứ không phải next/image: URL đến từ
          S3 do admin tải lên, không nằm trong danh sách domain cấu hình sẵn. */}
      <div className="team__photo" aria-hidden="true">
        {r.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.avatarUrl} alt="" loading="lazy" />
        ) : (
          <span className="team__initials">{initials(r.fullName)}</span>
        )}
      </div>
      <div className="team__body">
        <div className="team__name">{r.fullName}</div>
        {r.departmentName ? <div className="team__dept">{r.departmentName}</div> : null}
        {/* Mô tả đứng NGAY DƯỚI phòng ban, trên phần liên hệ: nó nói người này
            làm gì, còn liên hệ là thứ người đọc tìm sau khi đã quyết định gọi
            ai. */}
        {r.description ? <p className="team__desc">{r.description}</p> : null}
        {/* Liên hệ nằm dưới cùng, mỗi cách một "viên": email và số điện thoại
            là hai đích bấm khác nhau, viền riêng cho từng cái thì trên điện
            thoại không bấm nhầm sang cái bên cạnh. */}
        <div className="team__tags">
          {r.email ? (
            <a className="team__tag" href={`mailto:${r.email}`}>
              {r.email}
            </a>
          ) : null}
          {r.phone ? (
            // Same two forms as the footer and the contact page: the
            // international one is read, the national one is dialled. Rendering
            // r.phone raw here showed whatever BeeOps happened to store, so a
            // card could say "+84886440449" beside a footer saying
            // "(+84) 886 440 449" for the same person.
            <a className="team__tag" href={`tel:${phoneDial(r.phone)}`}>
              {phoneDisplay(r.phone)}
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
