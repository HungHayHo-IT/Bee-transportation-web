'use client';

import { useEffect, useRef, useState } from 'react';

import { dangSuaTaiCho } from '@/lib/cms-mode';

/**
 * Counts up once, the first time it is scrolled into view.
 *
 * The final value is rendered on the server so the number is in the HTML for
 * anyone who never runs the animation — a crawler, a reduced-motion user, or
 * a visitor who scrolls past before the observer fires.
 */
export function Counter({
  to,
  suffix = '',
  localeTag,
}: {
  to: number;
  suffix?: string;
  /** BCP47 tag — 26000 has to read as 26.000 in Vietnamese, 26,000 in English. */
  localeTag: string;
}) {
  // Deterministic for a given tag, so the server and the client agree.
  const format = new Intl.NumberFormat(localeTag);
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Đếm số là ghi đè liên tục nội dung của thẻ <b>, xoá luôn ô sửa nằm trong.
    if (dangSuaTaiCho()) return;
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let raf = 0;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          // Drop to zero only now: resetting on mount would make every
          // counter visibly flash its final value and start again.
          setValue(0);
          const t0 = performance.now();
          const DURATION = 1400;
          const step = (now: number) => {
            const k = Math.min((now - t0) / DURATION, 1);
            const eased = 1 - Math.pow(1 - k, 3);
            setValue(Math.round(to * eased));
            if (k < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <b className="count" ref={ref}>
      {format.format(value)}
      {value === to ? suffix : ''}
    </b>
  );
}
