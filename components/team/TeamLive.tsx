'use client';

import { useEffect, useRef, useState } from 'react';
import { InView } from '@/components/InView';
import { TeamRail } from '@/components/TeamRail';
import { toList, type Representative } from '@/lib/representatives';
import { TeamCard } from './TeamCard';

/** Nhịp hỏi lại khi khối đang hiện và nằm trong tầm mắt. */
const NHIP_MS = 20_000;
/**
 * Nhịp chậm cho lúc CHƯA có ai được bật.
 *
 * Lúc đó khối không vẽ gì cả nên không có gì để theo dõi trong tầm mắt, mà vẫn
 * phải hỏi — nếu không thì người vừa bật người đầu tiên sẽ không bao giờ thấy
 * khối hiện ra trên tab đang mở. Chậm hơn hẳn vì đây là trạng thái không có
 * nội dung, không đáng trả giá bằng một request mỗi 20 giây.
 */
const NHIP_RONG_MS = 60_000;

export interface TeamLiveProps {
  banDau: Representative[];
  chu: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    railLabel: string;
    prev: string;
    next: string;
  };
}

/**
 * Khối đội ngũ, tự cập nhật khi admin bật/tắt hay sửa người đại diện.
 *
 * Dựng sẵn ở máy chủ rồi mới sống: `banDau` là danh sách máy chủ đã vẽ, nên
 * không có khoảng trống lúc tải và máy tìm kiếm vẫn đọc được nội dung. Việc
 * hỏi lại chỉ THAY danh sách khi nó thực sự khác.
 *
 * Chỉ hỏi khi khối đang trong tầm mắt VÀ tab đang được xem — cuộn qua rồi hay
 * chuyển sang tab khác là ngừng hẳn. Không có hai điều kiện đó thì mỗi khách
 * mở trang đều trả tiền cho một request mỗi 20 giây suốt thời gian họ ở lại,
 * cho một khối họ đã lướt qua từ lâu.
 */
export function TeamLive({ banDau, chu }: TeamLiveProps) {
  const [ds, setDs] = useState<Representative[]>(banDau);
  /* Đặt trên khung băng trượt chứ không trên cả slide: `InView` giữ ref của
     riêng nó và không chuyển tiếp ra ngoài, mà thứ cần theo dõi cũng chính là
     băng thẻ — nó ra khỏi tầm mắt là không còn lý do hỏi lại. */
  const khung = useRef<HTMLDivElement>(null);
  /* Giữ bản JSON của lần vẽ gần nhất để so: so bằng chuỗi thay vì so từng
     trường, vì chỉ cần biết "có khác không" — khác thì vẽ lại cả danh sách. */
  const dau = useRef(JSON.stringify(banDau));

  const rong = ds.length === 0;

  useEffect(() => {
    let dungRoi = false;
    let hen: ReturnType<typeof setInterval> | null = null;
    let trongTam = false;

    const hoi = async (): Promise<void> => {
      if (document.visibilityState !== 'visible') return;
      try {
        const res = await fetch('/api/representatives', { cache: 'no-store' });
        if (!res.ok) return;
        const moi = toList(await res.json());
        if (dungRoi || moi === null) return;
        const chuoi = JSON.stringify(moi);
        if (chuoi === dau.current) return;
        dau.current = chuoi;
        setDs(moi);
      } catch {
        /* Mất mạng hay máy chủ chết thì GIỮ NGUYÊN bản đang hiện: xoá sạch
           khối chỉ vì một request trượt là biến một trục trặc thoáng qua
           thành một trang trống. */
      }
    };

    const batNhip = (nhip: number): void => {
      if (hen !== null) return;
      void hoi();
      hen = setInterval(() => void hoi(), nhip);
    };
    const tatNhip = (): void => {
      if (hen === null) return;
      clearInterval(hen);
      hen = null;
    };

    const theoTab = (): void => {
      const xem = document.visibilityState === 'visible';
      // Khối rỗng thì không có gì trên màn để theo dõi, chỉ cần tab đang mở.
      if (xem && (rong || trongTam)) batNhip(rong ? NHIP_RONG_MS : NHIP_MS);
      else tatNhip();
    };

    document.addEventListener('visibilitychange', theoTab);

    const el = khung.current;
    let mat: IntersectionObserver | null = null;
    if (el) {
      mat = new IntersectionObserver(([e]) => {
        trongTam = e?.isIntersecting ?? false;
        theoTab();
      });
      mat.observe(el);
    } else {
      theoTab();
    }

    return () => {
      dungRoi = true;
      tatNhip();
      mat?.disconnect();
      document.removeEventListener('visibilitychange', theoTab);
    };
  }, [rong]);

  /* Không còn ai được bật thì GIẤU cả khối, y như lúc máy chủ dựng trang —
     một tiêu đề "Đội ngũ" đứng trên khoảng trống còn tệ hơn là không có. */
  if (rong) return null;

  return (
    <InView as="section" className="page-slide team" id="team">
      <div className="wrap">
        <div className="page-slide__in">
          <div className="eyebrow">
            <i />
            {chu.eyebrow}
          </div>
          <h2 className="h2">
            {chu.title} <span className="hl">{chu.titleAccent}</span>
          </h2>
          <p className="lead">{chu.lead}</p>
        </div>

        {/* Băng trượt ngang chứ không phải lưới: danh sách dài ngắn tuỳ công ty
            bật bao nhiêu người, mà khối này là một slide chiếm trọn màn hình —
            lưới xuống hàng thứ hai là đẩy nửa dưới ra khỏi tầm nhìn. */}
        <div className="page-slide__in page-slide__in--late" ref={khung}>
          <TeamRail label={chu.railLabel} prevLabel={chu.prev} nextLabel={chu.next}>
            {ds.map((r) => (
              <TeamCard key={r.id} r={r} />
            ))}
          </TeamRail>
        </div>
      </div>
    </InView>
  );
}
