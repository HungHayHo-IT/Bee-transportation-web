'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Marks an element while it is on screen, so a slide can play its content in
 * once the scroll has actually landed on it.
 *
 * This exists because `Reveal` cannot do the job here. Reveal is a
 * scroll-driven animation (`animation-timeline: view()`), which ties progress
 * to scroll position — on a snapping full-screen slide the element is already
 * fully in view by the time the snap settles, so the animation would be over
 * before anyone saw it. An observer fires on arrival instead, and the
 * animation then runs on its own clock.
 *
 * Two classes, deliberately:
 *   `is-armed` — set after mount, i.e. only when this script is running. CSS
 *                hides the content behind this class, so with no JavaScript
 *                the slide renders plainly rather than staying blank.
 *   `is-in`    — set while the element is on screen. It is toggled rather than
 *                latched, so scrolling back to a slide plays it again.
 */
export function InView({
  as: Tag = 'div',
  id,
  className,
  /**
   * Accessible name for the element. Only needed when it renders as a landmark
   * that carries no heading of its own — a <section> otherwise goes unnamed.
   */
  'aria-label': label,
  /** Fraction of the element that must be visible before it counts as arrived. */
  threshold = 0.35,
  /**
   * Khối nội dung mà vùng này thuộc về, cho chế độ sửa của CMS.
   *
   * Khai ra thì màn CMS giấu đúng vùng cần giấu thay vì đoán theo "vùng này
   * còn ô nào thuộc mục đang mở không" — phép đoán đó sai ngay khi một vùng
   * mượn chữ của khối khác. Xem datPhamVi trong components/CmsEditor.tsx.
   */
  'data-cms-region': cmsRegion,
  children,
}: {
  as?: ElementType;
  id?: string;
  className?: string;
  'aria-label'?: string;
  threshold?: number;
  'data-cms-region'?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const heard = useRef(false);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without an observer, or with motion turned down, show the content and
    // leave it alone.
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || typeof IntersectionObserver === 'undefined') return;

    setArmed(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        heard.current = true;
        setInView(entry!.isIntersecting);
      },
      { threshold },
    );
    io.observe(el);

    // An observer normally reports on its very next frame. If it has said
    // nothing at all by now, it is not going to — a page that never paints
    // (a background tab, a headless capture) starves it — so disarm and let
    // the content show. Hiding copy behind an event that may not arrive is
    // not a trade worth making for an animation.
    const bail = window.setTimeout(() => {
      if (!heard.current) setArmed(false);
    }, 1200);

    return () => {
      io.disconnect();
      window.clearTimeout(bail);
    };
  }, [threshold]);

  const classes = [className, armed && 'is-armed', inView && 'is-in']
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      id={id}
      className={classes || undefined}
      aria-label={label}
      data-cms-region={cmsRegion}
    >
      {children}
    </Tag>
  );
}
