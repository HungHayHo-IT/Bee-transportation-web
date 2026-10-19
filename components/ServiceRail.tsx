'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { dangSuaTaiCho } from '@/lib/cms-mode';
import { addWheelScrub } from '@/lib/wheel-scrub';

/** How much of each neighbour is left showing beside a selected card, as a
 *  share of a card's width — the slice that tells the reader there is more on
 *  that side (NN/g, Baymard: always show part of what comes next). */
const PEEK = 0.22;
/** The least of a neighbour that is always left showing, even when keeping
 *  the selected card under the pointer would hide it: a reader with the
 *  pointer right against the screen edge still sees there is more. */
const MIN_PEEK = 28;
/** Least room a card keeps off the edge of the screen (the zoom needs about
 *  4% of a card's width on each side). */
const EDGE_ROOM = 18;
/** How far inside the card the pointer is kept when the row moves under it:
 *  the card the reader pointed at must still be the one under the pointer. */
const POINTER_ROOM = 28;
/** A band this wide along each edge of the row. If the pointer is right at
 *  the edge, the card under it cannot move far enough to show its neighbour
 *  without leaving the pointer; the pointer moving within this band, with
 *  cards still beyond that edge, brings the next one in — under the pointer. */
const EDGE_BAND = 48;
/** How long the row takes to move for a card, by distance: a nudge of a few
 *  pixels should not take as long as bringing in half a card. */
const REVEAL_MIN_MS = 260;
const REVEAL_MAX_MS = 520;
const REVEAL_MS_PER_PX = 1.4;
/** After the row moves, the pointer must travel this far before another card
 *  is picked. The row has just slid under a still pointer, and without this
 *  the first twitch could pick the neighbour that slid into place under it. */
const REARM_PX = 12;

/** Axis lock for wheel gestures over the row. A trackpad swipe sideways often
 *  opens with a few events that lean vertical, and judged one at a time those
 *  went to the page, which turned to the next slide mid-swipe. So the opening
 *  events are held (the page does not see them) until LOCK_PX of movement has
 *  added up, the axis is decided on the sums — sideways if the horizontal sum
 *  is at least LOCK_RATIO of the vertical one — and the whole gesture, momentum
 *  included, goes that way. A gesture ends after GESTURE_IDLE_MS of quiet;
 *  trackpad momentum can pause for more than 150ms mid-gesture.
 *
 *  Nấc con lăn chuột thì không giữ (xem notchAxis): một nấc chậm trên macOS
 *  chỉ báo ~4px, các nấc cách nhau quá GESTURE_IDLE_MS thì không bao giờ cộng
 *  đủ LOCK_PX, và nấc nào cũng bị nuốt — lăn chuột trên hàng thẻ không làm gì. */
const LOCK_PX = 30;
const LOCK_RATIO = 0.6;
const GESTURE_IDLE_MS = 350;

/** A sideways mouse-wheel notch's delta, in the speed it asks the row for. */
const GAIN = 0.22;
/** Least a sideways notch counts for: a slow notch on macOS reports ~4px. */
const NOTCH_PX = 100;
/** How much of the gap to the asked-for speed the row closes each frame. */
const ACCEL = 0.18;
/** What is left of the asked-for speed after a frame with nothing pushing it. */
const FRICTION = 0.92;
/** Ceiling on speed, so a flick of a free-spinning wheel stays readable. */
const MAX_SPEED = 60;
/** Below this nothing is visibly moving: settle rather than crawl for a second. */
const STILL = 0.05;

/** Cuộn dọc trên slide này lướt hàng thẻ — xem lib/wheel-scrub.ts. Mỗi nấc
 *  chuột đưa đúng một thẻ nữa vào giữa màn hình; với bàn di, mỗi cử chỉ ít
 *  nhất một thẻ, vuốt dài hơn thì đi theo độ dài, và luôn dừng ở chỗ có một
 *  thẻ đứng giữa.
 *
 *  Hàng đi tới đó theo một đường cong có thời lượng (SCRUB_MS_*): vào êm, ra
 *  êm, và TỚI NƠI đúng lúc. Trước là một lò xo: 300ms đầu đi đều, rồi bò thêm
 *  400ms nữa từng pixel một — 1, 0, 1, 0… — và chỗ bò đó đọc ra thành giật.
 *  Nấc sau tới khi hàng còn đang chạy thì đường mới nối tiếp từ đúng chỗ và
 *  đúng tốc độ đang có (Hermite bậc ba), nên lăn liền tay là một mạch trượt
 *  chứ không phải từng cú dừng rồi đi. */
const SCRUB_MS_MIN = 380;
const SCRUB_MS_MAX = 700;
const SCRUB_MS_PER_PX = 1.2;
/** Bàn di: quán tính của một cú vuốt tắt dần với hằng số thời gian cỡ này
 *  (ms), nên quãng nó còn đi ≈ tốc độ hiện tại × SCRUB_TAU. Đoán trước điểm
 *  dừng như thế — cách iOS và Chrome chọn điểm snap sau một cú vuốt — thì hàng
 *  nhắm đúng đích ngay từ đầu. Chờ quãng lăn thật cộng dồn thì đuôi quán tính
 *  (1–3 giây) dài hơn một đoạn trượt (~400ms): hàng tới chỗ dừng đầu, đứng
 *  lại, rồi mới đi tiếp khi đuôi cộng đủ. */
const SCRUB_TAU = 300;
/** Trần tốc độ đưa vào phép đoán đó (px/ms) — một cú vuốt rất mạnh cỡ 3–5. */
const SCRUB_V_MAX = 5;
/** Sau một sự kiện con lăn, con trỏ phải yên chừng này thì mới chọn thẻ lại:
 *  tay đặt trên chuột lúc lăn hay xê dịch vài pixel, và mỗi lần như thế giữa
 *  hai nấc là một thẻ nhấc lên, cả hàng mờ đi, rồi nấc sau lại trả về. */
const WHEEL_QUIET_MS = 600;
/** Chỗ dừng gần hơn chừng này phần bề ngang một thẻ thì bỏ qua: hàng đang
 *  đứng sát một chỗ dừng (sau khi rê chuột đẩy nó đi một chút) mà một nấc
 *  chỉ nhích vài pixel thì trông như con lăn không ăn. */
const SCRUB_MIN_STEP = 0.25;
/** Hàng còn cách chỗ dừng cuối hơn chừng này (px) thì vẫn tính là đang trượt
 *  — cử chỉ muốn sang slide lúc đó bị bỏ qua (xem start). */
const SCRUB_BUSY_PX = 8;
/** Phần chiều cao hàng thẻ phải nằm trong màn hình thì mới nhận cuộn dọc. */
const SCRUB_ON_SCREEN = 0.7;

/** Vào chậm, giữa nhanh, ra chậm — cùng nhịp với cú trượt slide của trang. */
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

/**
 * Trục của một nấc con lăn chuột thường, hay null nếu không phải một nấc.
 *
 * Nấc chuột không bao giờ là cú vuốt ngang mở đầu lệch dọc, nên không cần giữ
 * lại để đoán trục. Chrome và Safari báo mỗi nấc là bội của 120 ở wheelDelta,
 * còn với bàn di wheelDelta luôn đúng bằng 3 lần delta; Firefox báo nấc theo
 * dòng (deltaMode 1).
 */
const notchAxis = (e: WheelEvent): 'x' | 'y' | null => {
  const legacy = e as WheelEvent & { wheelDeltaX?: number; wheelDeltaY?: number };
  const notch = (delta: number, wheelDelta = 0) => {
    if (e.deltaMode !== 0) return true;
    const w = Math.abs(wheelDelta);
    return w > 0 && w % 120 === 0 && Math.abs(w - 3 * Math.abs(delta)) > 1;
  };
  if (e.deltaX === 0 && e.deltaY !== 0 && notch(e.deltaY, legacy.wheelDeltaY)) return 'y';
  if (e.deltaY === 0 && e.deltaX !== 0 && notch(e.deltaX, legacy.wheelDeltaX)) return 'x';
  return null;
};

/**
 * The horizontal row the home page's service cards sit in.
 *
 * It runs once, first card to last, and stops at both ends — there is no loop.
 *
 * One card at a time is selected — lifted, ringed, its button filled, the
 * other cards stepped back (CSS on `.is-active` and `[data-selecting]`) — and
 * the row places it so that all of it is in view with a slice of the card on
 * either side showing, so the reader always sees there is more each way.
 *
 * With a mouse, the card under the pointer is selected at once. The row moves
 * only as far as that placement needs, and never so far that the card leaves
 * the pointer: a card carried away from a still pointer leaves the reader
 * pointing at a different card from the one that is selected. The selection
 * is kept here rather than left to CSS `:hover` for the same reason — a card
 * sliding under a still pointer does not take it over; only the pointer
 * moving does. Clicks are held back while the row moves, and a click on a
 * card that is not the selected one selects it rather than opening it.
 *
 * On a touch screen none of that applies: there is no pointer to follow, and
 * a selected card with its neighbours dimmed is a desktop idea. The row is a
 * plain native swipe with momentum, snapping each card's start to the gutter
 * (CSS, like the card shelves on app stores), every card looks the same, the
 * scope points are always shown, and a tap opens the card. A vertical swipe
 * that starts on the row is the browser's to give to the page, which turns to
 * the next slide.
 *
 * Keyboard focus selects too. A sideways wheel (trackpad left/right, or
 * Shift+wheel) over the row scrolls it, locked to that axis for the whole
 * gesture (see LOCK_PX).
 *
 * Cuộn dọc (con lăn chuột, bàn di lên/xuống) với con trỏ nằm trên hàng thẻ
 * thì lướt hàng thẻ: mỗi nấc chuột đưa thẻ kế tiếp vào giữa màn hình, mỗi cú vuốt
 * bàn di ít nhất một thẻ và xa hơn nếu vuốt mạnh (xem SCRUB_TAU). Tới thẻ cuối
 * thì cử chỉ SAU sang slide tiếp; cuộn lên tới thẻ đầu thì cử chỉ sau về slide
 * trước. Cử chỉ do SlidePager tách và giao tới — xem lib/wheel-scrub.ts. Hàng
 * đang trượt dưới con trỏ đứng yên thì bỏ chọn thẻ, cùng lý do như trên: thẻ
 * đang chọn trôi khỏi con trỏ; con trỏ di chuyển lại thì chọn lại.
 *
 * Con trỏ ở chỗ khác trên slide (tiêu đề, khoảng trống) thì cuộn dọc sang
 * slide luôn, như mọi slide khác: hàng thẻ chỉ giữ con lăn khi người đọc đang
 * trỏ vào nó.
 */
export function ServiceRail({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Đang sửa tại chỗ: thẻ đứng yên để bấm trúng; dải vẫn cuộn ngang bằng
    // cách kéo hay thanh cuộn gốc của trình duyệt.
    if (dangSuaTaiCho()) return;
    const frameEl = el.parentElement;
    const track = el.firstElementChild as HTMLElement | null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    /** A screen with no hover at all — a phone or a tablet. */
    const touchOnly = window.matchMedia('(hover: none)');

    let raf = 0;
    /** Where the row is, as a float: scrollLeft rounds, and small wheel
     *  speeds would be lost to the rounding one frame at a time. */
    let pos = el.scrollLeft;
    let speed = 0;
    let asked = 0;
    let glide: { from: number; to: number; t0: number; dur: number } | null = null;
    /** Đích của cuộn dọc, và đường đi tới đó: từ p0 với tốc độ v0 (px/ms),
     *  bắt đầu lúc t0, dài dur ms. */
    let aim: number | null = null;
    let curve = { p0: 0, v0: 0, t0: 0, dur: 1 };
    /** Vị trí và tốc độ trên đường đi của cuộn dọc, lúc `t`. */
    const along = (t: number) => {
      const u = Math.min(1, Math.max(0, (t - curve.t0) / curve.dur));
      const { p0, v0, dur } = curve;
      const p1 = aim ?? p0;
      const u2 = u * u;
      const u3 = u2 * u;
      return {
        u,
        p: (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * dur * v0 + (3 * u2 - 2 * u3) * p1,
        v: ((6 * u2 - 6 * u) * (p0 - p1)) / dur + (3 * u2 - 4 * u + 1) * v0,
      };
    };
    let active: HTMLElement | null = null;
    let lastX = NaN;
    let lastY = NaN;
    let rearmX = NaN;
    let rearmY = NaN;

    const cards = () => [...el.querySelectorAll<HTMLElement>('.svc-card')];
    const max = () => Math.max(0, el.scrollWidth - el.clientWidth);
    const clamp = (p: number) => Math.min(max(), Math.max(0, p));
    const gap = () => (track ? parseFloat(getComputedStyle(track).columnGap) || 0 : 0);

    /** Wash out only the edge that still has cards beyond it. */
    const paintEdges = () => {
      frameEl?.toggleAttribute('data-rail-start', el.scrollLeft <= 1);
      frameEl?.toggleAttribute('data-rail-end', el.scrollLeft >= max() - 1);
    };

    /** The row has just moved under a still pointer: ignore it until it moves. */
    const settled = () => {
      rearmX = lastX;
      rearmY = lastY;
    };

    const tick = (now: number) => {
      raf = 0;
      if (glide) {
        const p = Math.min(1, (now - glide.t0) / glide.dur);
        pos = glide.from + (glide.to - glide.from) * ease(p);
        if (p >= 1) {
          glide = null;
          // Snap back on (touch screens) once the row is where it was sent —
          // on a card's snap point already, so it does not move again.
          el.style.scrollSnapType = '';
          settled();
        }
      } else if (aim !== null) {
        const at = along(now);
        pos = clamp(at.p);
        if (at.u >= 1) {
          pos = aim;
          aim = null;
          el.style.scrollSnapType = '';
          settled();
        }
      } else {
        speed += (asked - speed) * ACCEL;
        asked *= FRICTION;
        const next = clamp(pos + speed);
        // Settled, or pressed against an end.
        if ((Math.abs(speed) < STILL && Math.abs(asked) < STILL) || next === pos) {
          speed = 0;
          asked = 0;
        }
        pos = next;
      }
      el.scrollLeft = pos;
      paintEdges();
      if (glide || aim !== null || speed || asked) raf = requestAnimationFrame(tick);
    };
    const run = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    /** Move the row to `target` (clamped), eased over a time that follows the
     *  distance. */
    const glideTo = (target: number) => {
      const to = clamp(target);
      const dist = Math.abs(to - el.scrollLeft);
      if (dist < 2) return;
      speed = 0;
      asked = 0;
      aim = null;
      if (reduce.matches) {
        pos = to;
        el.scrollLeft = to;
        paintEdges();
        settled();
        return;
      }
      // Scroll-snap would pull every frame of the glide back to a snap point.
      el.style.scrollSnapType = 'none';
      pos = el.scrollLeft;
      const dur = Math.min(REVEAL_MAX_MS, Math.max(REVEAL_MIN_MS, dist * REVEAL_MS_PER_PX));
      glide = { from: pos, to, t0: performance.now(), dur };
      run();
    };

    /** Đưa hàng tới `target` (kẹp trong hai đầu) — gọi lại giữa chừng thì
     *  đường mới nối tiếp từ chỗ và tốc độ đang có, không khựng. */
    const aimTo = (target: number) => {
      const to = clamp(target);
      // Cùng đích thì để yên đường đang chạy. Bàn di gọi tới đây mỗi sự kiện,
      // và mỗi lần vẽ lại một đường 380ms cho quãng còn lại là đoạn cuối cứ
      // bị kéo dài mãi ra thành bò từng pixel.
      if (aim !== null && Math.abs(to - aim) < 0.5) return;
      glide = null;
      speed = 0;
      asked = 0;
      if (reduce.matches) {
        aim = null;
        pos = to;
        el.scrollLeft = to;
        paintEdges();
        settled();
        return;
      }
      const t = performance.now();
      let p = el.scrollLeft;
      let v = 0;
      if (aim !== null) ({ p, v } = along(t));
      const dist = Math.abs(to - p);
      if (dist < 1 && aim === null) return;
      const dur = Math.min(SCRUB_MS_MAX, Math.max(SCRUB_MS_MIN, dist * SCRUB_MS_PER_PX));
      // Đà đang có theo đúng chiều tới đích thì giữ, nhưng không quá mức làm
      // đường cong vọt qua đích rồi quay lại (Hermite còn đơn điệu khi
      // v0·dur ≤ 3·quãng đường). Đích nằm ngược chiều đang trượt thì bỏ đà:
      // giữ nó là hàng lao tiếp mấy khung hình theo chiều cũ — ngược hẳn với
      // tay người đọc — rồi mới giật quay lại.
      v = Math.sign(v) === Math.sign(to - p) ? Math.sign(v) * Math.min(Math.abs(v), (3 * dist) / dur) : 0;
      curve = { p0: p, v0: v, t0: t, dur };
      pos = p;
      aim = to;
      // Như glideTo: snap (màn cảm ứng) sẽ kéo từng khung hình về điểm neo.
      el.style.scrollSnapType = 'none';
      run();
    };

    /** Select `card`: lifted, ringed, button filled, the rest stepped back. */
    const setActive = (card: HTMLElement | null) => {
      if (card === active) return;
      active?.classList.remove('is-active');
      active = card;
      active?.classList.add('is-active');
      el.toggleAttribute('data-selecting', card !== null);
      // A selected card can sit close to the edge; the edge washes step aside.
      frameEl?.toggleAttribute('data-rail-selecting', card !== null);
    };

    /**
     * Place `card` wholly in view with a slice of each neighbour showing — as
     * little movement as that takes. If the pointer chose it (`x`), the card
     * is never carried out from under the pointer, though it always ends up
     * wholly on screen.
     */
    const place = (card: HTMLElement, x = NaN) => {
      const r = el.getBoundingClientRect();
      // The card's own box: the lift is a transform on the inside, so this is
      // the card at rest.
      const c = card.getBoundingClientRect();
      const list = cards();
      const i = list.indexOf(card);
      const peek = gap() + c.width * PEEK;
      const minLeft = r.left + (i > 0 ? peek : EDGE_ROOM);
      const maxRight = r.right - (i < list.length - 1 ? peek : EDGE_ROOM);

      let delta = 0;
      if (maxRight - minLeft < c.width) {
        // Too narrow for the card and both slices: share what there is.
        delta = c.left + c.width / 2 - (r.left + r.width / 2);
      } else if (c.right > maxRight) {
        delta = c.right - maxRight;
      } else if (c.left < minLeft) {
        delta = c.left - minLeft;
      }

      // In order: the card wholly on screen; a slice of at least MIN_PEEK of
      // each neighbour; the card still under the pointer; the full slice.
      if (!Number.isNaN(x) && delta !== 0) {
        const hasNext = i < list.length - 1;
        const hasPrev = i > 0;
        if (delta > 0) {
          // the card moves left: its right edge should stay past the pointer
          const keepUnder = c.right - x - POINTER_ROOM;
          const must = Math.max(
            0,
            c.right - (r.right - EDGE_ROOM),
            hasNext ? c.right - (r.right - gap() - MIN_PEEK) : 0,
          );
          delta = Math.max(Math.min(delta, keepUnder), must);
        } else {
          const keepUnder = x - c.left - POINTER_ROOM;
          const must = Math.max(
            0,
            r.left + EDGE_ROOM - c.left,
            hasPrev ? r.left + gap() + MIN_PEEK - c.left : 0,
          );
          delta = -Math.max(Math.min(-delta, keepUnder), must);
        }
      }
      glideTo(el.scrollLeft + delta);
    };

    const pick = (card: HTMLElement, x = NaN) => {
      setActive(card);
      place(card, x);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      // A card sliding under a still pointer is not the reader moving it:
      // browsers can report that as a move with the same coordinates.
      if (e.clientX === lastX && e.clientY === lastY) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (glide || aim !== null || performance.now() - wheelAt < WHEEL_QUIET_MS) return;
      if (!Number.isNaN(rearmX)) {
        if (Math.hypot(lastX - rearmX, lastY - rearmY) < REARM_PX) return;
        rearmX = NaN;
        rearmY = NaN;
      }

      // At either edge, with cards still beyond it: the next one comes in.
      const r = el.getBoundingClientRect();
      const list = cards();
      if (lastX >= r.right - EDGE_BAND && el.scrollLeft < max() - 1) {
        const next = list.find((c) => c.getBoundingClientRect().right > r.right - EDGE_ROOM + 1);
        if (next) {
          if (next !== active || next.getBoundingClientRect().right > r.right + 1) pick(next, lastX);
          return;
        }
      }
      if (lastX <= r.left + EDGE_BAND && el.scrollLeft > 1) {
        const prev = [...list].reverse().find((c) => c.getBoundingClientRect().left < r.left + EDGE_ROOM - 1);
        if (prev) {
          if (prev !== active || prev.getBoundingClientRect().left < r.left - 1) pick(prev, lastX);
          return;
        }
      }

      const card = e.target instanceof Element ? e.target.closest<HTMLElement>('.svc-card') : null;
      // In the gap between two cards the last one stays selected, so moving
      // from card to card does not flash the whole row back to normal.
      if (card && card !== active) pick(card, lastX);
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      rearmX = NaN;
      rearmY = NaN;
      lastX = NaN;
      lastY = NaN;
      if (!el.contains(document.activeElement)) setActive(null);
    };

    const onFocusIn = (e: FocusEvent) => {
      // A tap focuses the link on its way to opening it; on touch there is no
      // selection to make.
      if (touchOnly.matches) return;
      const card = e.target instanceof Element ? e.target.closest<HTMLElement>('.svc-card') : null;
      if (card) pick(card);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (el.contains(e.relatedTarget as Node | null)) return;
      if (!Number.isNaN(lastX)) return; // the mouse is still over the row
      setActive(null);
    };

    const onClick = (e: MouseEvent) => {
      // While the row moves, a click would land on whichever card happens to
      // be passing under the pointer.
      if (glide || (aim !== null && Math.abs(aim - pos) > 4)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // A tap opens the card it lands on.
      if (touchOnly.matches || (e as PointerEvent).pointerType === 'touch') return;
      // With a mouse, the card that opens is the one shown selected: a click
      // on another card (one the row has just slid under a still pointer)
      // selects it and brings it into place first.
      const card = e.target instanceof Element ? e.target.closest<HTMLElement>('.svc-card') : null;
      if (!card || card === active || !active) return;
      e.preventDefault();
      e.stopPropagation();
      pick(card, e.clientX);
    };

    /**
     * Chỗ tính bước tiếp theo cho chiều `dir` (1 tới, -1 lùi). Đang trượt
     * cùng chiều thì từ đích — nấc liền tay nối tiếp nhau, mỗi nấc một thẻ.
     * Đứng yên, hay đang trượt NGƯỢC chiều, thì từ chỗ hàng thực sự đang
     * đứng: tính từ đích cũ thì cuộn lên lúc hàng còn đang chạy xuống lại ra
     * một chỗ dừng vẫn nằm phía trước, và hàng bò tiếp về phía trước, chậm
     * hẳn đi, rồi mới quay lại.
     */
    const baseFor = (dir: number) => {
      if (aim === null) return el.scrollLeft;
      const at = along(performance.now()).p;
      return Math.sign(aim - at) === dir ? aim : at;
    };

    /** Hàng còn đi được theo chiều `dir` (1 tới, -1 lùi) không. */
    const canGo = (dir: number) => {
      const from = baseFor(dir);
      return dir > 0 ? from < max() - 1 : dir < 0 ? from > 1 : false;
    };

    /** Hàng đang trượt dưới con trỏ đứng yên vì con lăn: thẻ đang chọn sắp
     *  trôi khỏi con trỏ, nên bỏ chọn; con trỏ di chuyển lại thì chọn lại. */
    const letGo = () => {
      setActive(null);
      settled();
    };

    /** Mỗi chỗ dừng của cuộn dọc: một thẻ đứng giữa hàng, kẹp trong hai đầu —
     *  vài thẻ đầu và cuối không vào giữa được nên chung chỗ dừng ở hai đầu. */
    const stops = () => {
      const r = el.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      const at = cards().map((c) => {
        const b = c.getBoundingClientRect();
        return clamp(Math.round(el.scrollLeft + b.left + b.width / 2 - mid));
      });
      return [...new Set([0, ...at, max()])].sort((a, b) => a - b);
    };

    /** Hàng thẻ có đang nằm trên màn hình không — trang chỉ giao cuộn dọc
     *  cho nó khi người đọc đang nhìn thấy nó. */
    const onScreen = () => {
      const t = (track ?? el).getBoundingClientRect();
      const seen = Math.min(t.bottom, window.innerHeight) - Math.max(t.top, 0);
      return t.height > 0 && seen >= t.height * SCRUB_ON_SCREEN;
    };

    /** Cử chỉ dọc đang lướt hàng: từ đâu, chiều nào, đã đẩy bao xa (px), tốc
     *  độ hiện tại (px/ms) và lúc sự kiện trước tới, và chỗ dừng xa nhất đã
     *  nhắm — chỉ đi xa thêm, không lùi lại, trong một cử chỉ. */
    let scrubFrom = 0;
    let scrubDir: 1 | -1 = 1;
    let scrubTravel = 0;
    let scrubV = 0;
    let scrubAt = 0;
    let scrubBest = 0;

    const removeScrub = addWheelScrub({
      start(dir, e) {
        // Con trỏ phải nằm trên hàng thẻ (kể cả khe giữa hai thẻ và phần đệm
        // trên dưới cho thẻ nổi lên): ở chỗ khác thì trang sang slide luôn.
        if (!(e.target instanceof Node) || !el.contains(e.target)) return false;
        if (max() < 1 || !onScreen()) return false;
        // Tới đầu (hay cuối) rồi, nhưng hàng còn đang trượt tới đó: vẫn nhận
        // cử chỉ — nó chẳng đưa hàng đi đâu thêm — như trang bỏ qua cử chỉ tới
        // lúc slide còn đang được giữ. Không thì trang sang slide trong khi
        // hàng còn chạy ngang, hai chuyển động chồng lên nhau. Chỉ còn vài
        // pixel thì thôi, cho trang đi.
        const busy = aim !== null && Math.abs(aim - along(performance.now()).p) > SCRUB_BUSY_PX;
        if (!canGo(dir) && !busy) return false;
        scrubFrom = baseFor(dir);
        scrubDir = dir;
        scrubTravel = 0;
        scrubV = 0;
        scrubAt = 0;
        scrubBest = 0;
        letGo();
        return true;
      },
      move(dy, e) {
        scrubTravel += dy;
        // Tốc độ chỉ đo được từ sự kiện thứ hai: sự kiện mở đầu không có mốc
        // nào trước nó, và chia cho một khoảng đoán bừa thì một sự kiện lớn
        // (con lăn lạ không nhận ra là nấc) đọc thành cú vuốt cực mạnh.
        const now = performance.now();
        if (scrubAt) {
          const v = Math.min(SCRUB_V_MAX, Math.max(0, (dy * scrubDir) / Math.max(8, now - scrubAt)));
          scrubV = scrubV ? (scrubV + v) / 2 : v;
        }
        scrubAt = now;
        const card = cards()[0]?.getBoundingClientRect().width ?? 0;
        // Nấc chuột: đúng một thẻ nữa, tính từ chỗ hàng đang được đưa tới.
        // Theo quãng lăn thì cứ ba nấc mới đủ một thẻ — nấc chạy nấc không,
        // và hàng đi từng cú.
        const notch = notchAxis(e) === 'y';
        const base = notch ? baseFor(scrubDir) : scrubFrom;
        // Các chỗ dừng phía trước, tính bằng khoảng cách từ `base`.
        const ahead = stops()
          .map((s) => (s - base) * scrubDir)
          .filter((d) => d > card * SCRUB_MIN_STEP)
          .sort((a, b) => a - b);
        if (ahead.length === 0) {
          aimTo(scrubDir > 0 ? max() : 0);
          return;
        }
        if (notch) {
          aimTo(base + ahead[0]! * scrubDir);
          return;
        }
        // Ít nhất một thẻ; vuốt xa hơn thì tới chỗ dừng gần nhất với nơi cú
        // vuốt sẽ dừng (quãng đã đi + quãng quán tính còn lại, SCRUB_TAU).
        const push = scrubTravel * scrubDir + scrubV * SCRUB_TAU;
        let best = ahead.reduce((a, b) => (Math.abs(b - push) < Math.abs(a - push) ? b : a));
        best = Math.max(best, scrubBest);
        scrubBest = best;
        aimTo(scrubFrom + best * scrubDir);
      },
    });

    let axis: 'x' | 'y' | null = null;
    let sumX = 0;
    let sumY = 0;
    let wheelAt = -Infinity;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return; // pinch-zoom
      if (max() < 1) return;
      const now = performance.now();
      if (now - wheelAt >= GESTURE_IDLE_MS) {
        axis = null;
        sumX = 0;
        sumY = 0;
      }
      wheelAt = now;

      // Shift+wheel is sideways by definition: macOS sends it as deltaX,
      // Windows as deltaY with shiftKey set.
      const notch = notchAxis(e);
      if (e.shiftKey) axis = 'x';
      if (axis === null) axis = notch;
      if (axis === null) {
        sumX += Math.abs(e.deltaX);
        sumY += Math.abs(e.deltaY);
        if (sumX + sumY < LOCK_PX) {
          // Thuần dọc, và hàng còn đi được theo chiều đó: dù cú vuốt rốt cuộc
          // là gì, việc của sự kiện này cũng chỉ là lướt hàng thẻ — cho qua.
          if (sumX === 0 && canGo(Math.sign(e.deltaY))) return;
          // Undecided: hold it back from the page, and move nothing yet.
          e.preventDefault();
          return;
        }
        axis = sumX >= sumY * LOCK_RATIO ? 'x' : 'y';
      }
      // Vertical: the page's gesture. Left alone, SlidePager takes it and hands
      // it to the row while the row can still go that way (see addWheelScrub
      // above); at the first or last card, the page turns.
      if (axis === 'y') return;

      e.preventDefault();
      glide = null;
      aim = null;
      el.style.scrollSnapType = '';
      letGo();
      if (e.shiftKey || notch === 'x') {
        // A mouse wheel held sideways moves in notches of ~100px; eased into a
        // speed so the row glides rather than jumps a notch at a time.
        const delta = e.deltaX === 0 ? e.deltaY : e.deltaX;
        if (delta === 0) return;
        if (!raf) pos = el.scrollLeft;
        const push = Math.sign(delta) * Math.max(Math.abs(delta), NOTCH_PX);
        asked = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, asked + push * GAIN));
        run();
        return;
      }
      // A trackpad already sends smooth, fine deltas with its own momentum:
      // follow them one to one, like a native scroll. Easing them again on
      // top multiplied a light swipe into a run to the end of the row.
      if (e.deltaX === 0) return;
      speed = 0;
      asked = 0;
      pos = clamp(pos + e.deltaX);
      if (!raf) {
        el.scrollLeft = pos;
        paintEdges();
      }
    };

    // Touch drags and keyboard arrows scroll the row natively; keep the edge
    // fades and the float position in step with them.
    const onScroll = () => {
      if (!raf) pos = el.scrollLeft;
      paintEdges();
    };

    const observer = new ResizeObserver(() => {
      pos = clamp(el.scrollLeft);
      if (aim !== null) aim = clamp(aim);
      paintEdges();
    });
    observer.observe(el);
    paintEdges();

    /* Hàng ra khỏi màn hình thì đặt lại chỗ, theo phía người đọc vừa đi.

       Không đặt lại thì hàng giữ nguyên chỗ cũ: đã lướt tới thẻ cuối, đi
       tiếp, rồi một lúc sau quay lại từ phía trên — con trỏ trên thẻ, cuộn
       xuống, và trang sang slide luôn vì hàng "đã ở thẻ cuối". Hàng phủ kín
       hai bên nên nhìn không ra nó đang ở cuối, và người đọc thấy đó là lỗi.

       Hàng nằm dưới khung nhìn (người đọc đi lên): lần tới họ tới từ trên,
       nên về thẻ đầu. Nằm trên khung nhìn (đi xuống): lần tới họ cuộn ngược
       lên, nên đứng ở thẻ cuối và đi lùi qua từng thẻ. Làm lúc hàng đang
       khuất, nên không ai thấy nó nhảy. */
    const seen = new IntersectionObserver(([entry]) => {
      if (!entry || entry.isIntersecting) return;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      glide = null;
      aim = null;
      speed = 0;
      asked = 0;
      el.style.scrollSnapType = '';
      setActive(null);
      pos = entry.boundingClientRect.top > 0 ? 0 : max();
      el.scrollLeft = pos;
      paintEdges();
    });
    seen.observe(el);

    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);
    el.addEventListener('click', onClick, true);
    // Not passive: a sideways wheel must not also scroll anything else.
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
      el.removeEventListener('click', onClick, true);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', onScroll);
      removeScrub();
      observer.disconnect();
      seen.disconnect();
      if (raf) cancelAnimationFrame(raf);
      el.style.scrollSnapType = '';
      active?.classList.remove('is-active');
      el.removeAttribute('data-selecting');
      frameEl?.removeAttribute('data-rail-selecting');
    };
  }, []);

  return (
    // tabIndex makes the row reachable by keyboard: it scrolls with the arrow
    // keys once focused, and each card's link is a tab stop of its own.
    <div className="svc-rail" ref={ref} role="region" aria-label={label} tabIndex={0}>
      <ul className="svc-rail__track">{children}</ul>
    </div>
  );
}
