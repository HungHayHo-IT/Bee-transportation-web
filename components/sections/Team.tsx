import { TeamLive } from '@/components/team/TeamLive';
import { fetchRepresentatives } from '@/lib/representatives';
import type { Dictionary } from '@/lib/i18n';

/**
 * Đội ngũ đại diện. Dữ liệu lấy từ BeeOps (endpoint public), Admin bật/tắt
 * từng người trong /sale/representatives.
 *
 * Máy chủ dựng danh sách đầu tiên rồi giao cho TeamLive tự cập nhật — xem giải
 * thích ở đó. Fetch dùng chung với footer và trang liên hệ (xem
 * lib/representatives.ts); Next gộp các fetch trùng nhau trong một lần render,
 * nên ba nơi vẫn chỉ tốn một request lên backend.
 *
 * Chỉ truyền đúng mấy dòng chữ cần dùng chứ không truyền cả từ điển: mọi thứ
 * đưa cho một thành phần chạy ở trình duyệt đều bị gói kèm vào trang.
 */
export async function Team({ dict }: { dict: Dictionary }) {
  const reps = await fetchRepresentatives();

  /* Chưa có ai bật thì TeamLive tự giấu khối — không hiện "coming soon" trên
     landing chính thức. Vẫn dựng nó ra chứ không `return null` ở đây: nó cần
     được gắn vào trang để tự thấy người đầu tiên được bật, nếu không thì tab
     đang mở lúc danh sách còn rỗng sẽ không bao giờ hiện khối này ra. */
  return (
    <TeamLive
      banDau={reps ?? []}
      chu={{
        eyebrow: dict.team.eyebrow,
        title: dict.team.title,
        titleAccent: dict.team.titleAccent,
        lead: dict.team.lead,
        railLabel: dict.team.railLabel,
        prev: dict.team.prev,
        next: dict.team.next,
      }}
    />
  );
}
