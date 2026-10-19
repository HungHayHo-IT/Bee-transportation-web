/* ==========================================================================
   BEE TRANSPORTATION — hero film engine + caption overlay

   Ported from the static site's main.js with the clip logic untouched: this is
   imperative DOM code driving a requestAnimationFrame loop and setting
   `video.currentTime` directly, and rewriting it into React state would make
   it both slower and wrong. React's job here is to render the markup and call
   `initHeroEngine` once; everything below owns the DOM it is handed.

   What drives the film changed on 25/09/2026. It used to be the scroll
   position: the hero was several screens tall and the footage was scrubbed
   against it, so a reader wheeled through some seventy notches before the
   page moved on. Now the hero is one screen like every other slide, and the
   progress is a value this file animates on its own: the film plays through
   to its resting frame as soon as the clips are in, the wheel and ↓ are the
   page's from the first notch (components/SlidePager.tsx pages away, the
   snap lands ↓ on the next slide), and the ← → keys step back and forth
   between captions for anyone who wants to see one again.

   What IS new versus the static version is teardown. A static page never
   unmounts, so the original leaked nothing; under a client-side router the
   same code would leave a second rAF loop running and hold every decoded clip
   in memory. The disposer returned by initHeroEngine undoes all of it.
   ========================================================================== */

import { ghiNhoDaXem } from './da-xem';

export interface HeroEngineOptions {
  /** Clip URLs in play order. Must match the .hero__video elements 1:1. */
  sources: readonly string[];
}

/** Starts the engine. Call the returned function to dispose of it. */
export function initHeroEngine(options: HeroEngineOptions): () => void {
  /** Everything that must be undone on teardown, newest first. */
  const cleanups: Array<() => void> = [];
  let disposed = false;
  let rafId = 0;
  /** Object URLs minted for the fetched clips; revoked on teardown. */
  const objectUrls: string[] = [];
  /**
   * Aborts the clip downloads on teardown. Without it a remount — or React's
   * double-invoked effect in development — leaves 3.8MB of requests in flight
   * that nothing will ever use, and starts 3.8MB more alongside them.
   */
  const loadAbort = new AbortController();

  function on<K extends keyof WindowEventMap>(
    target: Window,
    type: K,
    fn: (ev: WindowEventMap[K]) => void,
  ): void {
    target.addEventListener(type, fn);
    cleanups.push(() => target.removeEventListener(type, fn));
  }

  /* ---------------------------------------------------------------- config */
  // Supplied by the caller so the clip list lives with the rest of the site
  // config rather than being buried in the engine.
  var SOURCES        = options.sources;
  // Footage speed while the film runs, 1 = real time. ĐÂY LÀ NÚM CHỈNH TỐC
  // ĐỘ: 17s of footage at 1.35 is ~12.6s from the opening frame to the
  // resting one, about two and a half seconds per caption. Above ~1.6 the
  // trucks visibly hurry; below ~1.2 the last caption, the one with the call
  // to action, takes too long to arrive.
  var PLAY_RATE      = 1.35;
  // Footage speed for an arrow step: twice the film. A step is asked for,
  // not watched — at PLAY_RATE the hop back from the resting frame took long
  // enough that the press seemed to have done nothing.
  var STEP_RATE      = PLAY_RATE * 2;
  // An arrow step never runs shorter than this, so a short hop still reads as
  // the film moving rather than cutting.
  var STEP_MIN_MS    = 700;
  // How long after the poster hands over before the film starts on its own:
  // a beat, so it is seen to start rather than found already running.
  var AUTOPLAY_DELAY_MS = 900;
  // How hard the clip is pulled toward the film position each frame.
  // Two rates: SMOOTHING while the position is still moving, so the picture
  // stays with it, and SETTLE_SMOOTHING once it stops, so the gap that has
  // built up plays out as a glide instead of being cut off. The resting
  // position is identical either way — only how long it takes to get there.
  var SMOOTHING        = 0.14;
  var SETTLE_SMOOTHING = 0.15;  // lower = longer glide-out
  var STILL_FRAMES     = 2;     // frames of an unchanged target before we call it stopped

  // Every clip is encoded at exactly 24fps (ffmpeg is given `fps=24`). If they
  // are ever re-encoded at another rate this has to match, or the frame pacing
  // below works against the wrong grid.
  var VIDEO_FPS      = 24;
  // Pacing limits for the glide-out. Without the upper bound a fast flick
  // advances several frames in one tick and visibly skips; without the lower
  // bound the last frames stretch further and further apart, which reads as a
  // stutter right at the end of the movement.
  var TAIL_MAX_STEP  = 1 / VIDEO_FPS;       // at most one frame per tick
  var TAIL_MIN_STEP  = 1 / VIDEO_FPS / 3;   // hold a frame for at most 3 ticks (~50ms)
  // Paced glide-out only applies to the gap a normal run leaves behind. A
  // jump (a hurried exit, a long arrow hop) must still catch up quickly
  // rather than crawl a frame at a time.
  var TAIL_MAX_GAP   = 1.2;
  var CAP_FADE       = 0.045;  // caption fade band, in progress units
  // Where the captions sit before anything has moved: just inside the first
  // band, so caption one is up and the rest are down.
  var CAP_REST       = 0.05;
  // Where the footage hands over to the K3c backdrop. The video fades out
  // across this band and the hero comes to rest on the CSS layer underneath;
  // the last frame of v4 is already close to black, so the swap reads as the
  // picture settling rather than as a cut.
  var STAGE_FADE_FROM = 0.92;
  var STAGE_FADE_TO   = 1.00;

  /* ------------------------------------------------------------------ dom */
  function $<T extends Element = HTMLElement>(sel: string, ctx?: ParentNode): T | null {
    return (ctx ?? document).querySelector<T>(sel);
  }
  function $$<T extends Element = HTMLElement>(sel: string, ctx?: ParentNode): T[] {
    return Array.prototype.slice.call((ctx ?? document).querySelectorAll<T>(sel));
  }

  var body         = document.body;
  var poster       = $('#heroPoster');
  var heroRest     = $('#heroRest');
  var heroRestVideo = $<HTMLVideoElement>('#heroRestVideo');

  /**
   * Bật clip nền của khung nghỉ — ĐÚNG MỘT LẦN.
   *
   * Cờ `daBatClipNghi` là cần thiết: lời gọi cũ nằm trong vòng lặp mỗi khung
   * hình và điều kiện của nó là `video.paused`, nên khi `play()` bị từ chối thì
   * nó gọi lại 60 lần mỗi giây, mãi mãi.
   */
  /**
   * Clip dùng làm nền lúc nghỉ — bước 3, cảnh đóng container.
   *
   * Tự tua `currentTime` chứ không gọi `play()`. `play()` là thứ trình duyệt có
   * quyền từ chối, và đã từ chối: thử hai lần, cả hai lần clip đứng im. Đặt
   * `currentTime` thì không phải là PHÁT nên không xin phép ai — đúng cách cả
   * bộ phim phía trên vừa được dựng.
   */
  var CLIP_NGHI = 2;
  var dangNghi = false;
  var nghiTu = 0;

  function tuaClipNghi(now: number): void {
    var v = videos[CLIP_NGHI];
    if (!v || !v.duration) return;
    var truoc = nghiTu;
    nghiTu = now;
    if (truoc === 0) return;
    // Chặn trên 0,1s: tab bị ẩn rồi quay lại thì `now` nhảy một quãng lớn, và
    // không chặn thì clip giật một phát qua mấy giây.
    var moi = v.currentTime + Math.min((now - truoc) / 1000, 0.1);
    v.currentTime = moi >= v.duration ? 0 : moi;
  }
  var preloadFill  = $('#preloadFill');
  var preloadPct   = $('#preloadPct');
  const heroRoot     = $('#hero');
  const heroStageEl  = $('.hero__stage');
  // One <video> per clip, in document order — which must be the play order.
  var videos       = $$<HTMLVideoElement>('.hero__video');
  var caps         = $$<HTMLElement>('.cap');
  var heroProgress = $('#heroProgress');
  var heroHint     = $('#heroHint');
  var chapters     = $$<HTMLElement>('.hud__chapter');
  var pageProgress = $('#pageProgress');

  // The engine is only mounted on the page that owns the hero markup. If any
  // of the three things it cannot work without is absent, do nothing rather
  // than throw halfway through wiring listeners.
  if (!heroRoot || !heroStageEl || videos.length === 0) {
    return () => {};
  }
  // Re-bound under the names the ported code already uses. Hoisted function
  // declarations below cannot see the narrowing above — TypeScript has to
  // assume one of them could run before the check — so the checked values are
  // handed on as plainly non-null constants.
  const hero: HTMLElement = heroRoot;
  const heroStage: HTMLElement = heroStageEl;

  // The only visitors who get sequential playback are the ones who have asked
  // the system for less motion, where a film that crossfades captions and
  // dissolves into the backdrop is exactly what they opted out of.
  function decideMode() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  var fallbackMode = decideMode();

  /* --------------------------------------------------------------- helpers */
  function clamp(v: number, a: number, b: number): number { return v < a ? a : v > b ? b : v; }
  function smoothstep(e0: number, e1: number, x: number): number {
    if (e1 === e0) return x < e0 ? 0 : 1;
    var t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  /* -------------------------------------------------------- caption stops */
  // Where the film rests for each caption: the opening frame, the middle of
  // each band, and 1 for the last — the resting frame, where the call to
  // action is. Read off the same data-from/data-to the captions are painted
  // from, so the arrow keys and the crossfades can never disagree about where
  // a caption is.
  var bands = caps.map(function (el) {
    return {
      from: parseFloat(el.dataset.from ?? '0'),
      to: parseFloat(el.dataset.to ?? '0'),
    };
  });
  var stops = bands.map(function (b, i) {
    if (i === 0) return 0;
    if (i === bands.length - 1) return 1;
    return (b.from + b.to) / 2;
  });
  if (stops.length < 2) stops = [0, 1];

  /** Which caption a progress value shows: the band it falls in, else the nearest. */
  function captionAt(p: number): number {
    var best = 0;
    var bestDist = Infinity;
    for (var i = 0; i < bands.length; i++) {
      if (p >= bands[i].from && p <= bands[i].to) return i;
      var d = Math.abs(p - (bands[i].from + bands[i].to) / 2);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  /* ==========================================================================
     1. LOADING — fetch every clip fully so seeking is instant.
        On file:// the fetch is blocked, so we fall back to plain <video src>.
     ========================================================================== */
  var totalBytes = 0;
  var loadedPerFile = SOURCES.map(function () { return 0; });

  function loadedBytes() {
    var sum = 0;
    for (var i = 0; i < loadedPerFile.length; i++) sum += loadedPerFile[i];
    return sum;
  }

  // totalBytes grows as each Content-Length header lands, so with several
  // clips in flight an early percentage is measured against a total that is
  // still incomplete. Never let the bar run backwards when that total jumps.
  var shownPct = 0;

  function reportProgress(pct: number): void {
    pct = clamp(Math.round(pct), 0, 100);
    if (pct < shownPct) return;
    shownPct = pct;
    if (preloadFill) preloadFill.style.width = pct + '%';
    if (preloadPct) preloadPct.textContent = String(pct);
  }

  function loadViaFetch(url: string, index: number): Promise<string> {
    return fetch(url, { signal: loadAbort.signal }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var len = parseInt(res.headers.get('content-length') || '0', 10);
      totalBytes += len;
      if (!res.body || !len) return res.blob();

      var reader = res.body.getReader();
      var chunks: BlobPart[] = [];
      return (function pump(): Promise<Blob> {
        return reader.read().then(function (r): Blob | Promise<Blob> {
          if (r.done) return new Blob(chunks, { type: 'video/mp4' });
          chunks.push(r.value);
          loadedPerFile[index] += r.value.length;
          reportProgress((loadedBytes() / totalBytes) * 100);
          return pump();
        });
      })();
    }).then(function (blob) {
      var url = URL.createObjectURL(blob);
      objectUrls.push(url);
      return url;
    });
  }

  function attach(video: HTMLVideoElement, src: string): Promise<HTMLVideoElement> {
    return new Promise(function (resolve, reject) {
      var settled = false;
      function ok() { if (!settled) { settled = true; resolve(video); } }
      video.addEventListener('loadedmetadata', function () {
        // one decoded frame on screen before we reveal the hero
        if (video.readyState >= 2) ok();
      });
      video.addEventListener('loadeddata', ok);
      video.addEventListener('error', function () {
        if (!settled) { settled = true; reject(new Error('Không tải được ' + src)); }
      });
      video.src = src;
      video.load();
      // safety net: never block the page forever
      setTimeout(ok, 15000);
    });
  }

  /**
   * Attach one clip, and if its blob will not decode, stream that clip — and
   * only that clip — from its own URL.
   *
   * The fallback used to be all-or-nothing, sitting on the same `.catch` as
   * the fetch phase: any single clip that failed to decode sent every clip
   * back onto the network. PageSpeed caught exactly that on a throttled
   * phone — v4 errored and the page fetched all four again, 3.9 MB for
   * nothing — so the two phases now fail independently.
   */
  function attachWithFallback(
    video: HTMLVideoElement,
    blobUrl: string,
    index: number,
  ): Promise<HTMLVideoElement> {
    return attach(video, blobUrl).catch(function (err) {
      if (disposed) throw err;
      console.warn('hero: clip ' + (index + 1) + ' không giải mã được từ blob, ' +
                   'phát trực tiếp thay thế — ' + (err && err.message));
      return attach(video, SOURCES[index]);
    });
  }

  function loadDirect() {
    // file:// or fetch failed → let the browser stream it, track readiness
    var ticks = 0;
    var timer = setInterval(function () {
      var sum = 0;
      videos.forEach(function (v) {
        if (v.buffered && v.buffered.length && v.duration) {
          sum += clamp(v.buffered.end(v.buffered.length - 1) / v.duration, 0, 1);
        }
      });
      ticks++;
      reportProgress(Math.max((sum / videos.length) * 100, Math.min(ticks * 2, 92)));
    }, 120);
    cleanups.push(function () { clearInterval(timer); });

    return Promise.all(videos.map(function (v, i) { return attach(v, SOURCES[i]); }))
      .then(function (r) { clearInterval(timer); return r; })
      .catch(function (e) { clearInterval(timer); throw e; });
  }

  function boot() {
    // SOURCES and the <video> elements are paired by position. A mismatch is
    // always an editing slip (a clip added to one list but not the other), and
    // it would otherwise show up as a silently missing chapter.
    if (videos.length !== SOURCES.length) {
      console.warn('hero: ' + SOURCES.length + ' clip nhưng ' +
                   videos.length + ' thẻ <video> — kiểm tra Hero.tsx');
    }

    var useFetch = location.protocol === 'http:' || location.protocol === 'https:';

    var chain = useFetch
      ? Promise.all(SOURCES.map(loadViaFetch))
          // The fetch phase stays all-or-nothing: with no blobs there is
          // nothing to attach, so streaming every clip is the only way on.
          // A teardown aborted the fetches — falling back here would start
          // downloading everything again, exactly what the abort was for.
          .catch(function (err) {
            if (disposed || (err instanceof DOMException && err.name === 'AbortError')) throw err;
            return null;
          })
          .then(function (urls) {
            if (!urls) return loadDirect();
            // The attach phase is per clip, so one clip that will not decode
            // cannot drag the other three back onto the network.
            return Promise.all(videos.map(function (v, i) {
              return attachWithFallback(v, urls[i], i);
            }));
          })
      : loadDirect();

    chain
      .then(function () { if (!disposed) start(); })
      .catch(function (err) {
        // A teardown mid-load is expected, not a failure.
        if (disposed || (err instanceof DOMException && err.name === 'AbortError')) return;
        console.error(err);
        // still show the page even if the videos refuse to load
        start();
      });
  }

  /* ==========================================================================
     2. HERO FILM ENGINE
     ========================================================================== */
  var durations = SOURCES.map(function () { return 0; });
  // starts[i] = where clip i begins on the combined timeline
  var starts = SOURCES.map(function () { return 0; });
  var totalDuration = 0;
  var currentTime = 0;      // smoothed position on the combined timeline
  var targetTime = 0;
  var stillFrames = 0;      // consecutive frames the film target has not moved
  var activeIndex = -1;

  /* ---- the film position ----
     `progress` runs 0..1 and is what every layer of the hero paints from:
     which frame of which clip, which caption is up, how far the stage has
     faded into the backdrop. It only ever moves by a tween, so the autoplay
     and the arrow keys go through one door. */
  var progress = 0;
  var tween: { from: number; to: number; t0: number; dur: number } | null = null;
  var started = false;

  /** How long progress takes to run 0→1 at footage speed `rate`. */
  function fullPlayMs(rate: number): number {
    // The footage covers 0..STAGE_FADE_FROM of progress; past that only the
    // fade runs, and it is given the same pace rather than a jump.
    var seconds = totalDuration > 0 ? totalDuration / STAGE_FADE_FROM : 12;
    return (seconds / rate) * 1000;
  }

  /**
   * Run the film to `to` at footage speed `rate`, so a hop of any length
   * looks like the same film moving. The play-through goes at PLAY_RATE and
   * an arrow step at STEP_RATE; otherwise they differ only in how far they go.
   */
  function goTo(to: number, rate: number): void {
    to = clamp(to, 0, 1);
    var dist = Math.abs(to - progress);
    if (dist < 1e-4) { tween = null; return; }
    tween = {
      from: progress,
      to: to,
      t0: performance.now(),
      dur: Math.max(dist * fullPlayMs(rate), STEP_MIN_MS),
    };
  }

  /**
   * Whether the hero is effectively the screen — the arrow keys only mean
   * anything while it is. How much of the screen it covers rather than how
   * near its edges are to the viewport's: a few pixels of drift is normal.
   */
  function heroOnScreen(): boolean {
    var r = hero.getBoundingClientRect();
    var covered = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    return covered >= window.innerHeight * 0.72;
  }

  function measure() {
    durations = videos.map(function (v) {
      return isFinite(v.duration) && v.duration > 0 ? v.duration : 0;
    });
    totalDuration = 0;
    for (var i = 0; i < durations.length; i++) {
      starts[i] = totalDuration;
      totalDuration += durations[i];
    }

    var want = decideMode();
    if (want !== fallbackMode) { fallbackMode = want; applyMode(); }

    if (fallbackMode || totalDuration === 0) {
      body.classList.add('hero-fallback');
      return;
    }
    body.classList.remove('hero-fallback');
  }

  // Re-measure the clips after any layout change — the mode can flip with it.
  function relayout() { measure(); }

  // Switch between the film and sequential playback (e.g. the motion setting changed).
  function applyMode() {
    if (fallbackMode) {
      runFallback();
    } else {
      videos.forEach(function (v) { v.pause(); });
      activeIndex = -1;
      setActive(0);
      currentTime = targetTime = 0;
      progress = 0;
      tween = null;
    }
  }

  function setActive(index: number): void {
    if (index === activeIndex) return;
    activeIndex = index;
    videos.forEach(function (v, i) { v.classList.toggle('is-active', i === index); });
    chapters.forEach(function (c, i) { c.classList.toggle('is-on', i === index); });

    // Park the neighbouring clips on the frames that touch the cut, once —
    // doing it every frame would make them compete for the decoder. Only the
    // immediate neighbours are worth parking: they are the only clips the film
    // can reveal next, and the cut is invisible only if the frame waiting on
    // the other side is the one that continues the shot.
    if (index > 0) seek(videos[index - 1], durations[index - 1]);
    if (index < videos.length - 1) seek(videos[index + 1], 0);
  }

  // Which clip owns a position on the combined timeline. Walking from the end
  // means a clip that failed to load (duration 0) is stepped straight over
  // instead of swallowing the positions around it.
  function clipIndexAt(t: number): number {
    for (var i = videos.length - 1; i > 0; i--) {
      if (t > starts[i]) return i;
    }
    return 0;
  }

  function frameIndex(t: number): number { return Math.floor(t * VIDEO_FPS + 1e-6); }

  function seek(video: HTMLVideoElement, time: number): void {
    if (!isFinite(video.duration) || video.duration <= 0) return;
    if (video.readyState < 1) return;
    // Never queue a seek on top of one still in flight: the decoder would spend
    // its time on positions the film has already moved past.
    if (video.seeking) return;
    var t = clamp(time, 0, Math.max(video.duration - 0.04, 0));
    // Skip only seeks that land on the frame already showing. Comparing raw
    // times instead would suppress real frame changes whenever a small gap
    // happens to straddle a frame boundary — which is what made the last
    // frames of the glide-out arrive late and unevenly.
    if (frameIndex(t) === frameIndex(video.currentTime)) return;
    try {
      video.currentTime = t;
    } catch (e) { /* not seekable yet — the next frame retries */ }
  }

  function paintCaptions(p: number): void {
    for (var i = 0; i < caps.length; i++) {
      var el = caps[i];
      var from = parseFloat(el.dataset.from ?? '0');
      var to = parseFloat(el.dataset.to ?? '0');
      var a = Math.min(
        smoothstep(from - CAP_FADE, from + CAP_FADE, p),
        1 - smoothstep(to - CAP_FADE, to + CAP_FADE, p)
      );
      var mid = (from + to) / 2;
      var dir = p < mid ? 1 : -1;
      var off = (1 - a) * 30 * dir;

      el.style.opacity = a.toFixed(3);
      el.style.transform = 'translate3d(0,' + off.toFixed(2) + 'px,0) scale(' + (0.985 + a * 0.015).toFixed(4) + ')';
      el.style.filter = a > 0.985 ? 'none' : 'blur(' + ((1 - a) * 5).toFixed(2) + 'px)';
    }
  }

  function frame(now: number) {
    if (!fallbackMode && totalDuration > 0) {
      if (tween !== null) {
        var k = clamp((now - tween.t0) / tween.dur, 0, 1);
        // Linear on purpose: the footage should run at one speed. The clip
        // smoothing below softens the start, and the glide-out the end.
        progress = tween.from + (tween.to - tween.from) * k;
        if (k >= 1) { progress = tween.to; tween = null; }
      }
      var p = progress;
      var prevTarget = targetTime;
      // The footage is spent by STAGE_FADE_FROM, not at the very end of the
      // run: the last frame has to be reached and held while the picture
      // dissolves into the backdrop, otherwise the closing beat of v4 plays out
      // at half opacity and is never actually seen.
      targetTime = clamp(p / STAGE_FADE_FROM, 0, 1) * totalDuration;

      // "Stopped" means the target itself has held still — the tween has
      // ended — not that no input arrived.
      if (Math.abs(targetTime - prevTarget) > 1e-6) stillFrames = 0;
      else stillFrames++;

      var diff = targetTime - currentTime;
      var mag = Math.abs(diff);
      if (stillFrames >= STILL_FRAMES && mag <= TAIL_MAX_GAP) {
        // Gliding to a halt: pace the remaining frames so none are skipped and
        // none of them stretch out, then land exactly on the target.
        var step = clamp(mag * SETTLE_SMOOTHING, TAIL_MIN_STEP, TAIL_MAX_STEP);
        currentTime = step >= mag ? targetTime
                                  : currentTime + (diff < 0 ? -step : step);
      } else {
        currentTime += Math.abs(diff) < 0.008 ? diff : diff * SMOOTHING;
      }

      /* Phim chạy xong thì KHÔNG đứng lại ở khung hình cuối nữa: chuyển sang
         clip bước 3 và cho nó lặp, ngay trên SÂN KHẤU này.

         Trước đây chỗ này làm mờ cả sân khấu đi để lộ một lớp nghỉ riêng mang
         thẻ <video> thứ năm. Thẻ đó không bao giờ chạy — và đó là điểm chính:
         nó là một đường dẫn dữ liệu SONG SONG, chưa từng được chứng minh là
         tải được, trong khi bốn thẻ ở đây vừa chạy trước mắt người xem suốt cả
         bộ phim. Dùng lại thứ đã chạy thay vì sửa tiếp thứ chưa bao giờ chạy.

         Không tải thêm một byte nào: clip bước 3 đã nằm sẵn trong bộ nhớ. */
      if (!dangNghi && smoothstep(STAGE_FADE_FROM, STAGE_FADE_TO, p) >= 1) {
        dangNghi = true;
        nghiTu = 0;
        setActive(CLIP_NGHI);
        ghiNhoDaXem();
      }

      if (dangNghi) {
        tuaClipNghi(now);
      } else {
        var index = clipIndexAt(currentTime);
        var local = currentTime - starts[index];
        setActive(index);
        seek(videos[index], local);
      }

      if (heroProgress) heroProgress.style.width = (p * 100).toFixed(2) + '%';
      paintCaptions(p);
      if (heroHint) heroHint.classList.toggle('is-hidden', p > 0.015);
    }

    // page-wide progress bar
    if (pageProgress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      pageProgress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0).toFixed(2) + '%';
    }

    // The header bar is components/layout/Nav.tsx's to drive — it is clear over
    // the hero and takes its tone from whatever is under it past that.

    if (!disposed) rafId = requestAnimationFrame(frame);
  }

  /* --------------------------------------------------------- the arrow keys
     ← and → step one caption while the hero is the screen — the way back to
     a caption the film has already left behind. Under reduced motion they
     skip a clip. ↑ and ↓ are left alone: they scroll the page and the snap
     lands them on a slide, which is what a keyboard reader expects of them.
     The wheel is never touched here either: any notch over the hero is the
     page's, and SlidePager pages away. Nothing is drawn for the keys — the
     film is the page's opening, not a carousel, and a pair of buttons on it
     would read as one. */
  function step(dir: -1 | 1): void {
    if (disposed) return;
    if (fallbackMode) {
      if (totalDuration === 0) return;
      fbPlay((fbIndex + dir + videos.length) % videos.length);
      return;
    }
    if (!started) return;
    var i = clamp(captionAt(progress) + dir, 0, stops.length - 1);
    goTo(stops[i], STEP_RATE);
  }

  function onKey(e: KeyboardEvent): void {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    // One press, one caption: a held key would otherwise race through them.
    if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    // Someone typing, or moving a caret, is not asking for the film.
    var t = e.target;
    if (
      t instanceof HTMLElement &&
      (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
    ) return;
    if (!heroOnScreen()) return;
    e.preventDefault();
    step(e.key === 'ArrowRight' ? 1 : -1);
  }
  on(window, 'keydown', onKey);

  /* --------------------------------------- fallback: play the clips in order */
  var fallbackWired = false;
  var fbIndex = 0;

  function fbPlay(n: number): void {
    fbIndex = n;
    videos.forEach(function (v, k) { v.classList.toggle('is-active', k === n); });
    chapters.forEach(function (c, k) { c.classList.toggle('is-on', k === n); });
    var v = videos[n];
    v.currentTime = 0;
    var pr = v.play();
    if (pr && pr.catch) pr.catch(function () {});
  }

  function runFallback() {
    body.classList.add('hero-fallback');
    // No film position to drive the handover here — the clips play straight
    // through, so the stage stays fully opaque over the backdrop.
    if (heroStage) heroStage.style.opacity = '1';
    if (totalDuration === 0) return;

    if (!fallbackWired) {
      fallbackWired = true;
      videos.forEach(function (v, n) {
        v.loop = false;
        v.addEventListener('timeupdate', function () {
          if (fallbackMode === false || n !== fbIndex || !v.duration) return;
          var global = starts[n] + (v.currentTime / v.duration) * durations[n];
          var p = totalDuration ? global / totalDuration : 0;
          paintCaptions(p);
          if (heroProgress) heroProgress.style.width = (p * 100).toFixed(2) + '%';
        });
        v.addEventListener('ended', function () {
          if (!fallbackMode || n !== fbIndex) return;
          if (n + 1 < videos.length) { fbPlay(n + 1); return; }
          /* Hết clip cuối là DỪNG. Trước đây chỗ này `% videos.length` nên nó
             quay về clip 0 và chạy vòng vô tận — người xem ngồi nhìn cùng một
             đoạn phim lặp mãi, và không lần nào được tính là đã xem xong. */
          v.pause();
          /* Dừng ở khung đầu của clip bước 3. KHÔNG lặp: người đã xin hệ thống
             bớt chuyển động thì một đoạn phim chạy vòng vô tận sau lưng đúng là
             thứ họ vừa từ chối. Vẫn là hình ảnh của cảnh đó, chỉ là đứng yên. */
          setActive(CLIP_NGHI);
          seek(videos[CLIP_NGHI], 0);
          paintCaptions(1);
          ghiNhoDaXem();
        });
      });
    }
    fbPlay(0);
  }

  /* ==========================================================================
     3. START
     ========================================================================== */
  function start() {
    started = true;
    measure();
    if (poster) {
      reportProgress(100);
      // Hold the poster one beat past 100% so the bar is seen finishing rather
      // than vanishing mid-count, then hand over to the decoded video.
      var showing = poster;
      var handOff = setTimeout(function () { showing.classList.add('is-done'); }, 260);
      cleanups.push(function () { clearTimeout(handOff); });
    }

    if (fallbackMode || totalDuration === 0) {
      if (totalDuration > 0) runFallback();
      if (totalDuration === 0) {
        // Nothing to show: drop the empty stage and leave the poster in place
        // — a still frame with the headline on it beats an empty hero.
        if (heroStage) heroStage.style.opacity = '0';
        if (poster) poster.classList.remove('is-done');
        paintCaptions(CAP_REST);   // captions still need a resting state
      }
    } else {
      setActive(0);
      seek(videos[0], 0);
      // The film plays itself, once, to the resting frame. Nothing waits on
      // the reader: scrolling is for leaving, and the arrow keys are for
      // coming back to a caption.
      var auto = setTimeout(function () {
        if (!disposed && tween === null && progress === 0) goTo(1, PLAY_RATE);
      }, AUTOPLAY_DELAY_MS);
      cleanups.push(function () { clearTimeout(auto); });
    }

    rafId = requestAnimationFrame(frame);

    var resizeTimer: ReturnType<typeof setTimeout>;
    on(window, 'resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(relayout, 180);
    });
    cleanups.push(function () { clearTimeout(resizeTimer); });

  }

  /* ---------------------------------------------------------------- start */
  // The captions carry the hero's <h1>, and .cap starts at opacity 0 because
  // only the engine knows which one belongs on screen. Nothing painted them
  // until boot() finished, which put the <h1> — the page's LCP element —
  // behind the whole 3.9 MB of footage: PageSpeed measured 5.08s of render
  // delay against a 1.2s first paint. Painting the resting state up front
  // costs nothing and changes nothing on screen: the poster is still over the
  // top until start() hands over, and the first frame corrects the position.
  paintCaptions(CAP_REST);

  boot();

  return function disposeHeroEngine() {
    if (disposed) return;
    disposed = true;
    if (rafId) cancelAnimationFrame(rafId);
    loadAbort.abort();
    tween = null;
    while (cleanups.length) cleanups.pop()!();
    for (const url of objectUrls) URL.revokeObjectURL(url);
    objectUrls.length = 0;
    // Drop the decoded frames too: without this the browser keeps every clip
    // buffered for as long as the elements are referenced.
    for (const v of videos) {
      v.pause();
      v.removeAttribute('src');
      v.load();
    }
  };
}
