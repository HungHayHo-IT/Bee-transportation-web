'use client';

import Image from 'next/image';
import { dangSuaTaiCho } from '@/lib/cms-mode';
import type { ImageProps } from '@/lib/image-slots';
import { replayAnimations } from '@/lib/replay-animation';
import { addWheelScrub } from '@/lib/wheel-scrub';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';


type Spec = { readonly label: string; readonly value: string };
type House = { readonly name: string; readonly specs: readonly Spec[] };

/**
 * The three functional warehouses, one at a time.
 *
 * A wheel over this slide moves to the next warehouse rather than the page: on
 * a page that snaps from slide to slide, a reader would otherwise be carried
 * past two of the three. It hands the wheel back at both ends — at the last
 * warehouse going down, at the first going up — so the slide is never a trap.
 *
 * The dots down the middle of the screen are buttons as well as a count. That
 * is what makes the other two reachable by keyboard, and by touch: a swipe is
 * left alone rather than captured, because taking over touch scrolling on a
 * snapping page is a good way to strand somebody.
 */
export function WarehouseTypes({
  heading,
  lead,
  houses,
  photos,
  label,
}: {
  heading: string;
  /** A line under the heading, in the room the left column has to spare. */
  lead?: ReactNode;
  houses: readonly House[];
  /** One photograph per house, in the same order — see capability.tsx. */
  /**
   * Props ảnh đã giải sẵn cho từng loại kho, không phải file ảnh: ảnh có thể
   * đến từ CMS (URL) hoặc từ repo (import tĩnh, kèm blur) — xem imageProps.
   */
  photos: readonly ImageProps[];
  /** Names the indicator, which is otherwise three unlabelled buttons. */
  label: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [at, setAt] = useState(0);
  /** Xem ghi chú cùng tên ở ProcessSlide: đọc sau khi gắn, không đọc lúc dựng. */
  const [suaTaiCho, setSuaTaiCho] = useState(false);
  useEffect(() => {
    setSuaTaiCho(dangSuaTaiCho());
  }, []);
  // Read inside the wheel handler, which is bound once and would otherwise
  // close over the first render's value.
  const atRef = useRef(0);
  atRef.current = at;

  const last = houses.length - 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Đang sửa thì cả ba loại kho đã bày ra, không còn gì để bước tới.
    if (suaTaiCho) return;

    /* Một cử chỉ, một loại kho — cử chỉ do SlidePager tách (lib/wheel-scrub.ts),
       cùng một phép cho nấc chuột và bàn di, y như hàng thẻ dịch vụ ở trang
       chủ và khối các bước. Khối này từng tự nghe con lăn: tới loại kho cuối
       là nó nhả, và đuôi quán tính của chính cú vừa đưa tới đó bị SlidePager
       đem đi sang slide sau. Ở đây cả cử chỉ là của khối; tới loại cuối thì
       cử chỉ SAU mới sang slide. */
    return addWheelScrub({
      start(dir, e) {
        const target = e.target instanceof Node ? e.target : null;
        if (!target || !el.contains(target)) return false;
        // Only while the slide is effectively the screen. Mid-snap it is still
        // arriving, and taking the wheel then fights the scroll bringing it in.
        const r = el.getBoundingClientRect();
        const covered = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        if (covered < window.innerHeight * 0.72) return false;
        const here = atRef.current;
        if ((dir === 1 && here >= last) || (dir === -1 && here <= 0)) return false;
        atRef.current = here + dir;
        setAt(here + dir);
        return true;
      },
      move() {},
    });
  }, [last, suaTaiCho]);

  const house = houses[at] ?? houses[0]!;

  // Kho đổi: chạy lại hiệu ứng trên chính các thẻ đang có, không đổi `key` —
  // xem lib/replay-animation.ts.
  const anhRef = useRef<HTMLDivElement>(null);
  const tenRef = useRef<HTMLHeadingElement>(null);
  const thongSoRef = useRef<HTMLDListElement>(null);
  const lanDau = useRef(true);
  useEffect(() => {
    if (lanDau.current) {
      lanDau.current = false;
      return;
    }
    replayAnimations(anhRef.current, tenRef.current, thongSoRef.current);
  }, [at]);

  return (
    <section
      ref={ref}
      className="page-slide warehouse-types"
      style={{ '--at': at, '--steps': houses.length } as CSSProperties}
    >
      <div className="wrap warehouse-types__grid">
        <div className="warehouse-types__intro">
          <h2 className="warehouse-types__heading">{heading}</h2>
          {lead}
        </div>

        {/* Down the middle of the screen, between the heading and the card:
            three dots say there are three of these before anyone scrolls. */}
        <ol className="warehouse-types__dots" aria-label={label}>
          {houses.map((h, i) => (
            <li key={h.name}>
              <button
                type="button"
                aria-current={i === at ? 'true' : undefined}
                aria-label={`${i + 1}. ${h.name}`}
                onClick={() => setAt(i)}
              />
            </li>
          ))}
        </ol>

        {/* Đang sửa: bày cả ba loại kho.
            Bình thường chỉ MỘT loại nằm trong trang — kể cả tấm ảnh, vì
            `photos[at]` chỉ dựng đúng một thẻ. Nghĩa là hai tấm ảnh kia không
            bấm vào đâu mà thay được, và chữ của hai loại kia không có ô nào để
            sửa. Bày hết ra là xong cả hai. */}
        {suaTaiCho ? (
          houses.map((h, i) => (
            <div className="warehouse-types__card" key={h.name}>
              <div className="warehouse-types__figure">
                <Image
                  {...photos[i]!}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  className="warehouse-types__img"
                />
              </div>
              <h3 className="warehouse-types__name">{h.name}</h3>
              <dl className="warehouse-types__specs">
                {h.specs.map((spec) => (
                  <div className="warehouse-types__spec" key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))
        ) : (
        <div className="warehouse-types__card" aria-live="polite">
          <div className="warehouse-types__figure" ref={anhRef}>
            {/* Decorative: the house is named and specified right below it.
                Only the open house is mounted, so the other two are never
                fetched until somebody actually turns to them. */}
            <Image
              {...photos[at]}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              className="warehouse-types__img"
            />
          </div>
          <h3 className="warehouse-types__name" ref={tenRef}>
            {house.name}
          </h3>
          <dl className="warehouse-types__specs" ref={thongSoRef}>
            {/* Khoá theo vị trí: khoá theo nhãn thì đổi kho là dòng bị gỡ. */}
            {house.specs.map((spec, i) => (
              <div className="warehouse-types__spec" key={i}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        )}
      </div>
    </section>
  );
}
