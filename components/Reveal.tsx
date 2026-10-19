import type { ElementType, ReactNode } from 'react';

/**
 * Scroll-in reveal — with no JavaScript at all.
 *
 * This used to be a client component holding an IntersectionObserver, which
 * put a client boundary around roughly fifty elements on every page and, worse,
 * left all of them at `opacity: 0` until JavaScript ran. If the bundle was slow
 * or failed, the page below the fold was blank.
 *
 * Now the resting state is *visible*, and the animation is layered on top with
 * a scroll-driven timeline where the browser supports one. Content is never
 * waiting on script to become readable, and this file ships no runtime.
 *
 * `delayIndex` still staggers a row: it offsets where in the element's entry
 * the animation runs, so a grid of cards arrives in sequence rather than at
 * once.
 */
export function Reveal({
  as: Tag = 'div',
  delayIndex = 0,
  className,
  id,
  children,
}: {
  as?: ElementType;
  /** Position within its group; every sixth element restarts the stagger. */
  delayIndex?: number;
  className?: string;
  /** Anchor target, so a link can land on this element rather than the page top. */
  id?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={className ? `reveal ${className}` : 'reveal'}
      style={{ '--i': Math.min(delayIndex % 6, 5) } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
