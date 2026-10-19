'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/** Khoảng cách giữa hai thẻ, khớp với `gap` của .team-rail__track trong CSS. */
const KHE = 22;
/** Ngưỡng coi như đã chạm mép: trình duyệt hay để lại lẻ vài phần của pixel. */
const MEP = 4;

export interface TeamRailProps {
  label: string;
  prevLabel: string;
  nextLabel: string;
  children: ReactNode;
}

/**
 * Băng trượt ngang cho các thẻ người đại diện.
 *
 * Cuộn thật bằng `overflow-x` chứ không phải một bộ trượt tự dựng: bánh xe
 * ngang, vuốt trên cảm ứng, kéo thanh cuộn, phím Tab tới một thẻ — tất cả đã
 * đúng sẵn. Hai nút mũi tên chỉ là cách thứ hai cho chuột.
 *
 * Nút tự ẩn khi không còn gì để trượt về phía đó: một mũi tên bấm vào không
 * xảy ra chuyện gì là nói dối người đọc rằng còn thẻ ở phía sau.
 */
export function TeamRail({ label, prevLabel, nextLabel, children }: TeamRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [conTruoc, setConTruoc] = useState(false);
  const [conSau, setConSau] = useState(false);

  const doLai = useCallback((): void => {
    const el = ref.current;
    if (!el) return;
    const toiDa = el.scrollWidth - el.clientWidth;
    setConTruoc(el.scrollLeft > MEP);
    setConSau(el.scrollLeft < toiDa - MEP);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    doLai();
    // Đo lại khi khung đổi cỡ: xoay điện thoại hoặc kéo cửa sổ có thể làm cả
    // băng vừa đủ một màn, lúc đó hai nút phải biến mất.
    const ro = new ResizeObserver(doLai);
    ro.observe(el);
    return () => ro.disconnect();
  }, [doLai]);

  const truot = (huong: 1 | -1): void => {
    const el = ref.current;
    if (!el) return;
    const the = el.querySelector('li');
    const buoc = the ? the.getBoundingClientRect().width + KHE : el.clientWidth * 0.8;
    // Ai đã tắt hiệu ứng chuyển động trong hệ điều hành thì nhảy thẳng tới nơi,
    // không trượt: trượt ngang là đúng kiểu chuyển động gây chóng mặt.
    const emDiu = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: huong * buoc, behavior: emDiu ? 'auto' : 'smooth' });
  };

  return (
    <div className="team-rail">
      <div
        className="team-rail__view"
        ref={ref}
        onScroll={doLai}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        <ul className="team-rail__track">{children}</ul>
      </div>

      <button
        type="button"
        className="team-rail__nav team-rail__nav--prev"
        aria-label={prevLabel}
        // `hidden` chứ không phải bỏ khỏi cây: nút biến mất rồi hiện lại làm
        // tiêu điểm bàn phím nhảy về đầu trang.
        hidden={!conTruoc}
        onClick={() => truot(-1)}
      >
        <Mui huong="trai" />
      </button>
      <button
        type="button"
        className="team-rail__nav team-rail__nav--next"
        aria-label={nextLabel}
        hidden={!conSau}
        onClick={() => truot(1)}
      >
        <Mui huong="phai" />
      </button>
    </div>
  );
}

/** Mũi tên vẽ bằng SVG, `aria-hidden` vì nhãn đã nằm trên nút. */
function Mui({ huong }: { huong: 'trai' | 'phai' }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d={huong === 'phai' ? 'M5 12h13M13 6l6 6-6 6' : 'M19 12H6M11 6l-6 6 6 6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
