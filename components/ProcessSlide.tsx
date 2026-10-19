'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { dangSuaTaiCho } from '@/lib/cms-mode';
import { imageProps } from '@/lib/image-slots';
import { replayAnimations } from '@/lib/replay-animation';
import { addWheelScrub } from '@/lib/wheel-scrub';

type Step = { readonly name: string; readonly body: string };

/**
 * The implementation slide: one step at a time in the middle of the screen,
 * with the truck standing on the step it is at along the road below.
 *
 * A wheel over this slide moves the truck on rather than the page — the steps
 * are the content here, and a page that snaps from slide to slide would carry
 * a reader past all but the first of them. It hands the wheel back at both
 * ends: at the last step going down, at the first going up. Without that the
 * slide is a trap, since the page has nothing else to scroll with.
 *
 * The dots are buttons as well as an affordance. That is what makes the steps
 * reachable by keyboard, and by touch — a swipe is left alone rather than
 * captured, because taking over touch scrolling on a snapping page is a good
 * way to strand somebody.
 */
export function ProcessSlide({
  heading,
  steps,
  images,
}: {
  heading: string;
  steps: readonly Step[];
  /** Ảnh đã ghi đè trong CMS, để lấy ô ảnh chiếc xe trên vạch. */
  images: Readonly<Record<string, string>>;
}) {
  const ref = useRef<HTMLElement>(null);
  const [at, setAt] = useState(0);
  /**
   * Chế độ sửa tại chỗ, đọc SAU khi gắn vào trang chứ không đọc lúc dựng.
   *
   * Đọc lúc dựng thì máy chủ ra một đằng, trình duyệt ra một nẻo, và React báo
   * lệch — máy chủ không có cách nào biết trang đang nằm trong khung CMS.
   */
  const [suaTaiCho, setSuaTaiCho] = useState(false);
  useEffect(() => {
    setSuaTaiCho(dangSuaTaiCho());
  }, []);
  // Read inside the wheel handler, which is bound once and would otherwise
  // close over the first render's value.
  const atRef = useRef(0);
  atRef.current = at;

  /**
   * Bước bị BỎ TRỐNG TÊN coi như đã xoá.
   *
   * CMS ghi đè từng ô một; nó không thêm hay bớt được phần tử của một danh
   * sách — làm được thế thì phải có cả một màn sắp xếp danh sách, và cả hai
   * đầu (landing lẫn backend) phải biết danh sách nào cho thêm bớt. Xoá tên
   * bước là cách bỏ một bước mà không cần gì trong số đó: danh sách trong code
   * vẫn nguyên, chỗ nào bỏ trống thì trang không vẽ ra.
   *
   * Lọc ở đây chứ không lọc trong từ điển: chỉ khối này hiểu "bước không tên
   * thì không phải là một bước".
   */
  const dung = steps.filter((s) => s.name.trim() !== '');
  const last = dung.length - 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Đang sửa thì không cướp con lăn: các bước đã bày ra hết, không còn gì để
    // bước tới, và giữ lại con lăn chỉ làm người sửa không cuộn qua được khối.
    if (suaTaiCho) return;

    /*
     * Một cử chỉ, một bước — cử chỉ do SlidePager tách (lib/wheel-scrub.ts),
     * cùng một phép cho nấc chuột và bàn di. Khối này từng tự nghe con lăn và
     * tự đoán cử chỉ: tới bước cuối là nó nhả, và phần đuôi quán tính của
     * chính cú vừa đưa tới bước cuối bị SlidePager đem đi sang slide sau —
     * bước cuối chỉ hiện chừng vài chục mili giây.
     *
     * Ở đây cả cử chỉ là của khối, đuôi gồm luôn; tới bước cuối thì cử chỉ SAU
     * mới sang slide.
     */
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
        // At the end in the direction being pushed: the page takes it from here.
        if ((dir === 1 && here >= last) || (dir === -1 && here <= 0)) return false;
        atRef.current = here + dir;
        setAt(here + dir);
        return true;
      },
      move() {},
    });
  }, [last, suaTaiCho]);

  const step = dung[at] ?? dung[0]!;

  // Bước đổi: chạy lại hiệu ứng hiện chữ trên CHÍNH hai thẻ đang có — xem
  // lib/replay-animation.ts về chuyện không đổi `key`.
  const tenRef = useRef<HTMLParagraphElement>(null);
  const moTaRef = useRef<HTMLParagraphElement>(null);
  const lanDau = useRef(true);
  useEffect(() => {
    if (lanDau.current) {
      lanDau.current = false;
      return;
    }
    replayAnimations(tenRef.current, moTaRef.current);
  }, [at]);

  return (
    <section
      ref={ref}
      className="slide-light service-process"
      style={{ '--steps': dung.length, '--at': at } as CSSProperties}
    >
      <h2 className="service-process__heading">{heading}</h2>

      {/* Đang sửa: bày HẾT các bước ra.
          Bình thường khối này chỉ giữ MỘT bước trong trang, và `key` đổi theo
          bước nên React thay hẳn thẻ <p> mỗi lần bước tới. Hai hệ quả ở màn
          CMS: các bước khác không có trong trang nên không bấm tới được, và ô
          sửa của bước đang xem bị vứt đi ngay khi bước sang bước kế — đang gõ
          dở thì mất chữ. Bày hết ra, khoá `key` theo tên bước, là cả hai hết. */}
      {suaTaiCho ? (
        <div className="wrap service-process__step service-process__step--all">
          {dung.map((s, i) => (
            <div className="service-process__one" key={s.name}>
              <p className="service-process__no" aria-hidden="true">
                {i + 1}
              </p>
              <p className="service-process__name">{s.name}</p>
              <p className="service-process__body">{s.body}</p>
            </div>
          ))}
        </div>
      ) : (
        /* The copy is replaced under the reader rather than by them, so it is
           announced. */
        <div className="wrap service-process__step" aria-live="polite">
          <p className="service-process__name" ref={tenRef}>
            {step.name}
          </p>
          <p className="service-process__body" ref={moTaRef}>
            {step.body}
          </p>
        </div>
      )}

      <div className="service-process__track">
        <div className="service-process__road">
          {/* Full width, so the percentage it is moved by is a share of the
              road rather than of the truck. */}
          <div className="service-process__truck" aria-hidden="true">
            {/* Thẻ ảnh thật, không phải ảnh nền CSS: ảnh nền thì CMS không đính
                được tên ô vào, mà không có tên ô thì bấm vào cũng không biết
                đang thay tấm nào. */}
            <span>
              <Image {...imageProps('processTruck', images)} alt="" fill sizes="(max-width: 860px) 80px, 160px" />
            </span>
          </div>

          <ol className="service-process__dots">
            {dung.map((s, i) => (
              // Placed by index rather than by a column, so a dot lands under
              // the truck at every stop — see .service-process__dots li.
              <li key={s.name} style={{ '--i': i } as CSSProperties}>
                <button
                  type="button"
                  aria-current={i === at ? 'step' : undefined}
                  aria-label={`${i + 1}. ${s.name}`}
                  onClick={() => setAt(i)}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
