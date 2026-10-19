'use client';

import { useEffect } from 'react';

import { dangSuaTaiCho } from '@/lib/cms-mode';
import { takeWheelScrub, type WheelScrub } from '@/lib/wheel-scrub';

/** Quãng trượt một màn hình dài bao lâu. ĐÂY LÀ NÚM CHỈNH TỐC ĐỘ.
 *  700ms là một nhịp đi thong thả: mắt bám được cả đoạn đường chứ không chỉ
 *  thấy trang đã ở chỗ khác. Dưới 400ms bắt đầu đọc ra thành giật. */
const GLIDE_MS = 700;
/** Least time a slide is held before the next gesture is taken.
 *  Dài hơn quãng trượt, để cử chỉ sau không cắt ngang cú đang chạy. */
const SLIDE_MS = GLIDE_MS + 160;
/** Khoảng lặng ngăn cách hai CỬ CHỈ. Con lăn phải im lâu chừng này thì cú lăn
 *  tiếp theo mới là một cử chỉ mới; ngắn hơn là vẫn cùng một cú, dù đã lăn
 *  bao nhiêu nấc hay vuốt bao nhiêu lần.
 *
 *  Đây là thứ giữ cho "lăn nhanh" không thành "đi nhanh". Trước là 140ms, và
 *  cuộn nhanh bằng chuột là một chuỗi cú gảy ngón tay cách nhau 150–250ms:
 *  mỗi cú gảy lọt qua khe đó thành một cử chỉ riêng, và trang đi hai ba
 *  slide trong một hơi. 300ms nuốt cả chuỗi ấy làm một; muốn slide tiếp thì
 *  dừng tay một nhịp rồi lăn lại — đúng cái nhịp người ta vẫn dừng để nhìn. */
const IDLE_MS = 300;
/** Pixels a gesture must add up to before it pages. One: any real push
 *  counts. It was 4, and a slow notch of a plain mouse on macOS arrives as a
 *  few pixels — the notch did nothing and the page looked stuck. */
const MIN_DELTA = 1;
/** Pixels in a line and in a page, for wheels that report in those units
 *  (Firefox reports a mouse notch as 3 lines). */
const LINE_PX = 16;
/** Một cú vuốt mới chen vào đuôi quán tính — xem "Momentum" ở ghi chú bên
 *  dưới. So RECENT sự kiện mới nhất với BASE sự kiện ngay trước chúng, cả về
 *  cỡ mỗi sự kiện lẫn tốc độ px/ms: phải gấp RISE_RATIO lần, cỡ hơn ít nhất
 *  RISE_MIN px; và luồng phải đã tụt xuống dưới TAIL_RATIO của đỉnh cú trước
 *  — chuột lăn đều không bao giờ tụt như vậy, quán tính thì luôn tụt.
 *
 *  Tốc độ là thứ chặn báo nhầm: khi trang bận, Chrome gộp hai khung hình
 *  quán tính thành một sự kiện gấp đôi — nhưng nó cũng đến trễ gấp đôi, nên
 *  px/ms không đổi. Cỡ thì nhảy, tốc độ thì không; tay người đẩy lại thì cả
 *  hai cùng nhảy. */
const RECENT = 3;
const BASE = 4;
const RISE_RATIO = 2;
const RISE_MIN = 3;
const TAIL_RATIO = 0.5;

/**
 * One wheel gesture, one screen.
 *
 * CSS scroll-snap on its own does not do this. The browser lets the gesture
 * scroll freely first and only then pulls to the nearest snap point, so a
 * reader sees the page creep, stop, and then finish the move on its own — the
 * beat of hesitation this exists to remove. `scroll-snap-type: mandatory`
 * still earns its place underneath: it is what a keyboard, a touch drag and a
 * resize land on, and it is what holds the page on a slide boundary when this
 * component is not the one moving it.
 *
 * One gesture is one unbroken run of wheel events — the notches of a spin,
 * the fingers on a trackpad and the momentum after they lift, all of it —
 * and it ends only after IDLE_MS of silence. The first event of a gesture
 * pages; every later one belongs to that same gesture and does nothing, so
 * how fast or how long the wheel is worked cannot change how far the page
 * goes. A gesture that starts while a slide is still held is dropped rather
 * than queued: queueing is exactly how a fast scroll turns into a fast page.
 *
 * Momentum. After a trackpad or Magic Mouse swipe on macOS the OS keeps
 * sending shrinking wheel events for one to three seconds — long after the
 * page has come to rest. A reader who swipes again inside that tail never
 * leaves a quiet gap, so on silence alone their second swipe was folded into
 * the first and thrown away: the page looked stuck until they moved the
 * pointer, which cost enough time for the tail to die out. But momentum only
 * ever shrinks and never turns round. So once the slide is no longer held,
 * the last few deltas jumping well above the few before them — in size AND in
 * pixels per millisecond, after the stream has sunk below half its peak — or
 * any delta the other way, is a hand on the device again and starts a new
 * gesture. That is the approach fullPage.js and Lethargy take (a recent
 * average against an older one); Chrome gives no phase or momentum flag to
 * tell them apart directly. A mouse spun fast never produces that pattern —
 * its notches hold steady or speed up, with no sunken tail before them — so
 * it still pages once.
 *
 * Nothing under a wheel scrolls natively, not even the events too small or
 * too sideways to count. Let one through and the browser scrolls a few real
 * pixels, and the mandatory snap then finishes the move to whichever slide it
 * likes — a slightly diagonal flick, or the tail of a trackpad's momentum,
 * was enough to drift the page a slide past where this had put it.
 *
 * What this does NOT take:
 *
 * * A slide that has already handled the wheel itself. The process slide, the
 *   warehouse types (both on inner pages) step through their own content and
 *   call preventDefault when they do; the check for it here is what keeps
 *   those working, so this listener must stay on the bubble phase — capture
 *   would run before them and swallow the gesture they were about to use.
 *   On the home page nothing holds a vertical wheel itself: the hero's film
 *   plays on its own, and the service rail is handed its vertical gestures
 *   from here (lib/wheel-scrub.ts) — it runs through its cards first, and
 *   only the gesture after the last card pages on.
 * * Touch and keyboard, as input. A swipe is native scrolling plus snap, and
 *   the arrow keys, Page Up/Down and Home/End keep their own meanings. The
 *   one thing done about touch is the fling limit below — taking those
 *   over is how a page becomes unusable for anybody who does not scroll with
 *   a wheel.
 */
export function SlidePager() {
  useEffect(() => {
    // Đang sửa thì cuộn phải là cuộn thường. Nhảy nguyên một màn mỗi lần lăn
    // chuột là thứ khiến người sửa không tài nào dừng đúng đoạn chữ cần sửa.
    if (dangSuaTaiCho()) return;
    /* Tìm lại <main> mỗi lần dùng, KHÔNG giữ từ lúc gắn: SlidePager nằm ở
       layout, gắn một lần cho cả phiên, còn bấm link là Next thay <main> mới.
       Giữ bản cũ thì sau một lần chuyển trang nó đo trên các slide đã gỡ khỏi
       trang — đi xuống trông vẫn đúng (từng màn từ 0), nhưng từ chân trang đi
       lên thì lệch đúng phần chân trang ngắn hơn một màn. Trang không lật
       slide (bài tin tức…) thì trả null và trang cuộn thường. */
    const slides = () =>
      document.querySelector<HTMLElement>('main.home-slides, main.page-slides');

    /**
     * The scroll positions a slide starts at, plus the foot of the document
     * for the footer, which is shorter than a screen and so rests at the end
     * rather than at its own top — same reasoning as its snap rule in CSS.
     *
     * Measured per gesture rather than cached: slide heights follow the
     * viewport, images settle in, and a stale list would page to a position
     * that no longer starts a slide.
     */
    const stops = (): number[] => {
      const main = slides();
      if (!main) return [];
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const tops = [...main.children]
        .filter((el): el is HTMLElement => el instanceof HTMLElement)
        .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
        .filter((top) => top <= max);
      return [...new Set([0, ...tops, max])].sort((a, b) => a - b);
    };

    /** When the last wheel event of any size arrived: a gesture ends IDLE_MS
     *  after this, and not before. */
    let lastAt = -Infinity;
    /** True from the first event of a gesture until that gesture has been
     *  judged — paged, or dropped because the slide was still held. A trackpad
     *  gesture opens with a few events of a pixel or two, so the event that
     *  gets to judge it is usually not the one that opened it: a flag, not a
     *  check on the gap alone, or a trackpad would never page at all. */
    let armed = false;
    /** Vertical delta the current gesture has added up so far. */
    let acc = 0;
    /** Direction of the last gesture that was judged: 1 down, -1 up. */
    let dir = 0;
    /** Momentum tracking: sizes (|deltaY| in px) and arrival times of the
     *  last few events, newest last, and the largest size since the last
     *  gesture was judged — counting only events that have already left the
     *  BASE and RECENT windows.
     *
     *  Chỉ những sự kiện đã ra khỏi hai cửa sổ: đỉnh mà còn tính cả chúng thì
     *  đoạn ngón tay TĂNG TỐC ở đầu một cú vuốt (1, 3, 6, 10, 14, 18…) đọc ra
     *  đúng hình "tụt xuống rồi vọt lên", và một cú vuốt thành hai cử chỉ. Khi
     *  trang sang slide thì lúc giữ slide che mất chuyện đó; với hàng thẻ dịch
     *  vụ (không có lúc giữ) một cú vuốt nhẹ đi luôn hai thẻ. */
    let sizes: number[] = [];
    let times: number[] = [];
    let peak = 0;
    /** Chiều của sự kiện trước (1 xuống, -1 lên) — xem chỗ dùng bên dưới. */
    let lastSign = 0;

    /** Khối đã nhận cử chỉ hiện tại — xem lib/wheel-scrub.ts. Phần còn lại
     *  của cử chỉ, đuôi quán tính gồm luôn, đi tới nó chứ không tới trang. */
    let owner: WheelScrub | null = null;

    const startGesture = () => {
      armed = true;
      acc = 0;
      owner = null;
    };

    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

    /** Có phải một bàn tay vừa đẩy lại, giữa đuôi quán tính? */
    const pushedAgain = (): boolean => {
      // One more time than sizes: each window's speed is measured from the
      // event before it.
      if (sizes.length < RECENT + BASE + 1) return false;
      const n = sizes.length;
      const recentSizes = sizes.slice(n - RECENT);
      const baseSizes = sizes.slice(n - RECENT - BASE, n - RECENT);
      // The whole rise must have come after the hold: a swipe begun while the
      // slide was still moving is dropped, not deferred.
      if (times[n - RECENT]! < heldUntil) return false;
      const recent = mean(recentSizes);
      const base = mean(baseSizes);
      const span = (a: number, b: number) => Math.max(8, times[b]! - times[a]!);
      const vRecent = (recent * RECENT) / span(n - RECENT - 1, n - 1);
      const vBase = (base * BASE) / span(n - RECENT - BASE - 1, n - RECENT - 1);
      return (
        base <= peak * TAIL_RATIO &&
        recent >= base * RISE_RATIO &&
        recent - base >= RISE_MIN &&
        vRecent >= vBase * RISE_RATIO
      );
    };
    /** The current slide is held until this time; no gesture is taken before. */
    let heldUntil = 0;
    let running = 0;

    /**
     * Đưa trang tới `to` trong GLIDE_MS, tự nội suy từng khung hình.
     *
     * Phải TẮT snap trong lúc chạy. Dưới `scroll-snap-type: mandatory`, mỗi
     * lần ghi vị trí cuộn lại bị kéo về điểm neo gần nhất, nên hoạt ảnh bị
     * nuốt và trang nhảy thẳng tới đích ngay khung hình đầu — đo được: đặt
     * quãng 750ms thì tới nơi ở mốc 101ms. Bật lại ngay khi xong, và vì đích
     * đến vốn đã là một biên slide nên lần bật lại đó không dịch trang đi đâu.
     *
     * Không dùng `behavior:'smooth'` của trình duyệt: thời lượng do trình
     * duyệt tự quyết, không chỉnh được, và đó chính là thứ đang cần chỉnh.
     *
     * Người bật giảm chuyển động thì nhảy thẳng — với họ hoạt ảnh mới là thứ
     * gây khó chịu, và trình duyệt cũng đã tắt sẵn mọi cuộn trượt.
     */
    const glide = (to: number, onBoundary: boolean) => {
      const doc = document.documentElement;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        doc.style.scrollSnapType = onBoundary ? '' : 'none';
        window.scrollTo({ top: to, behavior: 'instant' });
        return;
      }

      if (running) cancelAnimationFrame(running);
      const from = window.scrollY;
      const t0 = performance.now();
      doc.style.scrollSnapType = 'none';

      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / GLIDE_MS);
        // Vào chậm, giữa nhanh, ra chậm — một nhịp đi, không phải một cú ném.
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        window.scrollTo(0, Math.round(from + (to - from) * e));
        if (p < 1) {
          running = requestAnimationFrame(step);
          return;
        }
        running = 0;
        /* Chỉ trả snap lại khi chỗ dừng LÀ một biên slide.
           Dừng giữa một slide cao hơn màn hình mà bật mandatory lên thì trình
           duyệt hút ngay tới biên sau — đo được: chặn ở 2509 thì nó kéo tiếp
           tới 2768, tức là cái chặn một-màn-một-cú bị vô hiệu. Snap ngủ cho
           tới khi trang về đúng một biên, và lúc đó nó chẳng dịch đi đâu. */
        doc.style.scrollSnapType = onBoundary ? '' : 'none';
      };
      running = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (!slides()) return;
      // Trackpad pinch-zoom and modified wheels are not scrolling.
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // An element that scrolls on its own under the pointer keeps the wheel:
      // the language menu, and anything that overflows.
      //
      // Tested for rather than cast: a wheel event can be dispatched at the
      // document or at the window, and both answer `target` with something
      // that has no closest().
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('[data-wheel-native]')) return;

      // Every wheel event, however small, keeps the current gesture alive: the
      // momentum tail of a trackpad is still the same gesture. A gap of
      // IDLE_MS or more is where a new gesture starts.
      const now = performance.now();
      const quiet = now - lastAt >= IDLE_MS;
      lastAt = now;
      if (quiet) {
        startGesture();
        sizes = [];
        times = [];
      }

      // A slide took this event for its own content. Still counted above: hàng
      // thẻ dịch vụ giữ lại vài sự kiện đầu của một cú vuốt cho tới khi biết nó
      // ngang hay dọc, và nếu trang không thấy chúng thì đuôi quán tính của cú
      // cuộn vừa đưa trang tới đây đọc ra thành một cử chỉ mới.
      if (e.defaultPrevented) return;

      // Từ đây trang không bao giờ tự cuộn theo con lăn — kể cả với những sự
      // kiện bên dưới không đủ thành một cử chỉ. Xem ghi chú đầu file.
      e.preventDefault();

      // Sideways is not paging.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const dy =
        e.deltaMode === 1 ? e.deltaY * LINE_PX
        : e.deltaMode === 2 ? e.deltaY * window.innerHeight
        : e.deltaY;
      const size = Math.abs(dy);
      if (size === 0) return;

      // Đổi chiều thì xoá lịch sử: quán tính không bao giờ quay đầu, nên đem
      // so sự kiện của chiều mới với đuôi của chiều cũ là vô nghĩa. Để lẫn thì
      // đoạn ngón tay tăng tốc của cú vuốt lên đứng cạnh đuôi cú vuốt xuống
      // trước đó đọc ra thành "vuốt thêm lần nữa", và MỘT cú vuốt lên vừa kéo
      // hàng thẻ dịch vụ về vừa đẩy trang sang slide trước, cùng một lúc.
      if (Math.sign(dy) !== lastSign) {
        lastSign = Math.sign(dy);
        sizes = [];
        times = [];
        peak = 0;
      }
      sizes.push(size);
      times.push(now);
      if (sizes.length > RECENT + BASE + 1) { sizes.shift(); times.shift(); }
      if (sizes.length === RECENT + BASE + 1) peak = Math.max(peak, sizes[0]!);

      // Không có khoảng lặng nào, nhưng có thể là một cú mới chen vào đuôi
      // quán tính — xem "Momentum" ở ghi chú đầu file. Quán tính không bao
      // giờ đổi chiều, nên đổi chiều luôn là tay người.
      if (!armed && now >= heldUntil) {
        const turned = dir !== 0 && Math.sign(dy) === -dir;
        if (turned || pushedAgain()) startGesture();
      }

      if (!armed) {
        owner?.move(dy, e);
        return;
      }
      // A trackpad gesture opens with a pixel or two; they are added up
      // rather than each judged, and the sum decides the direction.
      acc += dy;
      if (Math.abs(acc) < MIN_DELTA) return;

      // Một cử chỉ, một slide: mỗi chuỗi được xét đúng một lần, tại đây — đi,
      // hoặc bỏ vì slide hiện tại còn đang được giữ. Bỏ chứ không xếp hàng.
      armed = false;
      dir = acc > 0 ? 1 : -1;
      peak = 0;
      if (now < heldUntil) return;

      // Slide đang đứng có nội dung để lướt qua trước (hàng thẻ dịch vụ), và
      // con trỏ nằm trên nó: nó nhận cử chỉ chừng nào còn đi được theo chiều
      // này. Con trỏ ở chỗ khác trên slide thì trang sang slide luôn. Tới thẻ cuối (hay
      // thẻ đầu, khi cuộn lên) thì nó trả lại, và cử chỉ SAU mới sang slide —
      // cử chỉ đang chạy tới đó thì dừng ở đó, không trượt luôn qua slide.
      owner = takeWheelScrub(dir === 1 ? 1 : -1, e);
      if (owner) {
        owner.move(acc, e);
        return;
      }

      const list = stops();
      const here = window.scrollY;
      const vh = window.innerHeight;
      const forward = acc > 0;
      // Tolerance so a resting position a pixel or two off a boundary — scroll
      // anchoring nudges the page whenever content above it changes height —
      // still counts as being on it, rather than paging by that pixel.
      const bound = forward
        ? list.find((top) => top > here + 2)
        : [...list].reverse().find((top) => top < here - 2);

      if (bound === undefined) return;

      /* Không bao giờ đi quá một màn hình trong một cú.
         Slide cao đúng một màn là trường hợp thường, nhưng không phải luôn:
         trên màn thấp, nội dung tràn ra và slide dài thành 1513px trong khi
         khung nhìn chỉ 627px — nhảy thẳng tới biên sau là đi hơn hai màn một
         lúc, chóng mặt và bỏ qua nguyên một đoạn chưa đọc. Đi đúng một màn
         rồi dừng giữa slide: snap cho phép, vì vùng neo cao hơn khung nhìn
         thì mọi vị trí còn phủ kín khung nhìn đều là chỗ nghỉ hợp lệ. */
      const next = forward
        ? Math.min(bound, here + vh)
        : Math.max(bound, here - vh);

      heldUntil = now + SLIDE_MS;
      glide(next, next === bound);
    };

    /* ------------------------------------------------------------ touch
       Một cú vuốt cảm ứng, nhiều nhất một slide.

       Cảm ứng vẫn là cuộn gốc của trình duyệt cộng snap — không chiếm lấy
       ngón tay. Nhưng `scroll-snap-stop: always` không được tôn trọng: đo
       trên Chrome mobile, một cú vuốt mạnh từ hero bay thẳng tới slide 3,
       vuốt mạnh hơn tới slide 5. Nên ở đây: khi chạm, ghi lại hai biên slide
       quanh chỗ đang đứng; nếu cuộn (ngón tay kéo hay quán tính sau đó) vượt
       qua một trong hai, trang bị giữ lại ngay tại biên đó cho tới hết cú.

       Giữ bằng `overflow:hidden` trên gốc — cách duy nhất cắt được quán tính
       đang chạy trên cả Chrome lẫn Safari — rồi trả lại khi ngón tay đã nhấc
       và quán tính đã bị cắt. Biên là một điểm snap, nên lúc trả lại trang
       đứng yên ở đó.

       Chỉ canh khi ngón tay thật sự KÉO, và chỉ tới khi cuộn dừng: một cú
       chạm vào link neo (#lien-he, link bỏ qua điều hướng) cũng là một
       touchstart, và cú nhảy nó gây ra không được phép bị giữ lại. */
    let touchLo = 0;
    let touchHi = 0;
    let touchY0 = 0;
    let touching = false;
    let watching = false;
    let locked = false;
    let watchTimer = 0;

    const unlock = () => {
      if (!locked) return;
      locked = false;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };

    const onTouchStart = (e: TouchEvent) => {
      unlock();
      touching = false;
      watching = false;
      touchY0 = e.touches[0]?.clientY ?? 0;
      const list = stops();
      if (list.length === 0) return;
      const y = window.scrollY;
      touchLo = [...list].reverse().find((top) => top < y - 2) ?? list[0]!;
      touchHi = list.find((top) => top > y + 2) ?? list[list.length - 1]!;
      touching = true;
      watching = false;
      window.clearTimeout(watchTimer);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touching || watching) return;
      const y = e.touches[0]?.clientY ?? touchY0;
      if (Math.abs(y - touchY0) > 8) watching = true;
    };

    const onTouchEnd = () => {
      touching = false;
      window.clearTimeout(watchTimer);
      if (locked) {
        // The finger is up and the page is pinned: let go once the fling
        // that was cut has had a frame to notice.
        watchTimer = window.setTimeout(() => { unlock(); watching = false; }, 80);
        return;
      }
      // A fling runs on after the finger lifts; stop watching once the page
      // has been still for a moment (onScroll pushes this out while it moves).
      if (watching) watchTimer = window.setTimeout(() => { watching = false; }, 150);
    };

    const onScroll = () => {
      if (!watching) return;
      const y = window.scrollY;
      const limit = y > touchHi + 1 ? touchHi : y < touchLo - 1 ? touchLo : null;
      if (limit === null) {
        if (!touching) {
          window.clearTimeout(watchTimer);
          watchTimer = window.setTimeout(() => { watching = false; }, 150);
        }
        return;
      }
      if (!locked) {
        locked = true;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      }
      window.scrollTo({ top: limit, behavior: 'instant' });
      if (!touching) {
        window.clearTimeout(watchTimer);
        watchTimer = window.setTimeout(() => { unlock(); watching = false; }, 80);
      }
    };

    // Not passive: this stops the page scrolling freely underneath.
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(watchTimer);
      unlock();
      // Rời trang giữa chừng thì snap phải được trả lại, nếu không trang sau
      // thừa hưởng một thuộc tính inline tắt snap mà không ai biết từ đâu ra.
      if (running) {
        cancelAnimationFrame(running);
        document.documentElement.style.scrollSnapType = '';
      }
    };
  }, []);

  return null;
}
