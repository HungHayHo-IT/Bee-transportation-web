/* ==========================================================================
   BEE TRANSPORTATION — landing page interactions
   Core feature: the hero pins to the viewport and the clip chain (v1 → v4)
   is *scrubbed* by the scroll wheel. When the last clip reaches its final
   frame the hero unpins and the normal sections below take over.

   The four clips are one continuous shot cut into pieces: the last frame of
   each matches the first frame of the next, so they are played back to back
   with no dissolve. Adding or removing a clip is a matter of editing SOURCES
   and the matching <video> elements / HUD chapters in index.html — nothing
   below assumes a particular count.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- config */
  var SOURCES        = ['v1.mp4', 'v2.mp4', 'v3.mp4', 'v4.mp4'];
  var PX_PER_SECOND  = 420;    // scroll distance dedicated to 1s of footage
  var MIN_SCROLL     = 2400;   // never shorter than this (px)
  var MAX_SCROLL     = 7200;   // never longer than this (px)
  // How hard the clip is pulled toward the scroll position each frame.
  // Two rates: SMOOTHING while the wheel is still moving, so the picture stays
  // with the scroll, and SETTLE_SMOOTHING once it stops, so the gap that has
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
  // Paced glide-out only applies to the gap a real gesture leaves behind. A
  // jump (anchor link, restored scroll position) must still catch up quickly
  // rather than crawl a frame at a time.
  var TAIL_MAX_GAP   = 1.2;
  var CAP_FADE       = 0.045;  // caption fade band, in progress units
  // Where the footage hands over to the K3c backdrop. The video fades out
  // across this band and the hero comes to rest on the CSS layer underneath;
  // the last frame of v4 is already close to black, so the swap reads as the
  // picture settling rather than as a cut.
  var STAGE_FADE_FROM = 0.92;
  var STAGE_FADE_TO   = 1.00;

  /* ------------------------------------------------------------------ dom */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var body         = document.body;
  var preloader    = $('#preloader');
  var preloadFill  = $('#preloadFill');
  var preloadPct   = $('#preloadPct');
  var hero         = $('#hero');
  var heroStage    = $('.hero__stage');
  // One <video> per clip, in document order — which must be the play order.
  var videos       = $$('.hero__video');
  var caps         = $$('.cap');
  var heroProgress = $('#heroProgress');
  var heroHint     = $('#heroHint');
  var chapters     = $$('.hud__chapter');
  var pageProgress = $('#pageProgress');
  var nav          = $('#nav');

  // Scrubbing a video with the wheel only makes sense on a pointer device with
  // room to breathe; phones and reduced-motion users get sequential playback.
  function decideMode() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (window.matchMedia('(pointer: coarse)').matches) return true;
    // a hidden/detached viewport reports 0 — don't let that lock us into fallback
    var w = window.innerWidth || document.documentElement.clientWidth || 1280;
    return w <= 700;
  }
  var fallbackMode = decideMode();

  /* --------------------------------------------------------------- helpers */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smoothstep(e0, e1, x) {
    if (e1 === e0) return x < e0 ? 0 : 1;
    var t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
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

  function reportProgress(pct) {
    pct = clamp(Math.round(pct), 0, 100);
    if (pct < shownPct) return;
    shownPct = pct;
    if (preloadFill) preloadFill.style.width = pct + '%';
    if (preloadPct) preloadPct.textContent = pct;
  }

  function loadViaFetch(url, index) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var len = parseInt(res.headers.get('content-length') || '0', 10);
      totalBytes += len;
      if (!res.body || !len) return res.blob();

      var reader = res.body.getReader();
      var chunks = [];
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(chunks, { type: 'video/mp4' });
          chunks.push(r.value);
          loadedPerFile[index] += r.value.length;
          reportProgress((loadedBytes() / totalBytes) * 100);
          return pump();
        });
      })();
    }).then(function (blob) {
      return URL.createObjectURL(blob);
    });
  }

  function attach(video, src) {
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
                   videos.length + ' thẻ <video> — kiểm tra index.html');
    }

    var useFetch = location.protocol === 'http:' || location.protocol === 'https:';

    var chain = useFetch
      ? Promise.all(SOURCES.map(loadViaFetch))
          .then(function (urls) {
            return Promise.all(videos.map(function (v, i) { return attach(v, urls[i]); }));
          })
          .catch(function () { return loadDirect(); })
      : loadDirect();

    chain.then(start).catch(function (err) {
      console.error(err);
      // still show the page even if the videos refuse to load
      start();
    });
  }

  /* ==========================================================================
     2. HERO SCRUB ENGINE
     ========================================================================== */
  var durations = SOURCES.map(function () { return 0; });
  // starts[i] = where clip i begins on the combined timeline
  var starts = SOURCES.map(function () { return 0; });
  var totalDuration = 0;
  var scrollLength = MIN_SCROLL;
  var currentTime = 0;      // smoothed position on the combined timeline
  var targetTime = 0;
  var stillFrames = 0;      // consecutive frames the scroll target has not moved
  var activeIndex = -1;

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
      hero.style.removeProperty('--hero-h');
      return;
    }
    body.classList.remove('hero-fallback');

    // a viewport that reports 0 (hidden tab, detached frame) would give the
    // hero a bogus height — wait until it is real
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (!vh) { setTimeout(relayout, 250); return; }

    scrollLength = clamp(totalDuration * PX_PER_SECOND, MIN_SCROLL, MAX_SCROLL);
    hero.style.setProperty('--hero-h', (scrollLength + vh) + 'px');
  }

  // Re-measure the hero and redraw the route overlay after any layout change.
  function relayout() { measure(); buildRoutes(); }

  // Switch between scrub and sequential playback (e.g. phone rotated to landscape).
  function applyMode() {
    if (fallbackMode) {
      runFallback();
    } else {
      videos.forEach(function (v) { v.pause(); });
      activeIndex = -1;
      setActive(0);
      currentTime = targetTime = 0;
    }
  }

  function heroProgressValue() {
    var rect = hero.getBoundingClientRect();
    var travelled = -rect.top;
    var span = hero.offsetHeight - window.innerHeight;
    if (span <= 0) return 0;
    return clamp(travelled / span, 0, 1);
  }

  function setActive(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    videos.forEach(function (v, i) { v.classList.toggle('is-active', i === index); });
    chapters.forEach(function (c, i) { c.classList.toggle('is-on', i === index); });

    // Park the neighbouring clips on the frames that touch the cut, once —
    // doing it every frame would make them compete for the decoder. Only the
    // immediate neighbours are worth parking: they are the only clips a scroll
    // can reveal next, and the cut is invisible only if the frame waiting on
    // the other side is the one that continues the shot.
    if (index > 0) seek(videos[index - 1], durations[index - 1]);
    if (index < videos.length - 1) seek(videos[index + 1], 0);
  }

  // Which clip owns a position on the combined timeline. Walking from the end
  // means a clip that failed to load (duration 0) is stepped straight over
  // instead of swallowing the positions around it.
  function clipIndexAt(t) {
    for (var i = videos.length - 1; i > 0; i--) {
      if (t > starts[i]) return i;
    }
    return 0;
  }

  function frameIndex(t) { return Math.floor(t * VIDEO_FPS + 1e-6); }

  function seek(video, time) {
    if (!isFinite(video.duration) || video.duration <= 0) return;
    if (video.readyState < 1) return;
    // Never queue a seek on top of one still in flight: the decoder would spend
    // its time on positions the scroll has already moved past.
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

  function paintCaptions(p) {
    for (var i = 0; i < caps.length; i++) {
      var el = caps[i];
      var from = parseFloat(el.dataset.from);
      var to = parseFloat(el.dataset.to);
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

  function frame() {
    if (!fallbackMode && totalDuration > 0) {
      var p = heroProgressValue();
      var prevTarget = targetTime;
      // The footage is spent by STAGE_FADE_FROM, not at the very bottom of the
      // hero: the last frame has to be reached and held while the picture
      // dissolves into the backdrop, otherwise the closing beat of v4 plays out
      // at half opacity and is never actually seen.
      targetTime = clamp(p / STAGE_FADE_FROM, 0, 1) * totalDuration;

      // Momentum scrolling keeps moving the target after the finger lifts, so
      // "stopped" means the target itself has held still, not that no input
      // event arrived.
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

      var index = clipIndexAt(currentTime);
      var local = currentTime - starts[index];

      setActive(index);
      seek(videos[index], local);

      // Hand over to the K3c backdrop. Fading the whole stage rather than the
      // clips themselves leaves the A/B crossfade between clips alone, and
      // takes the vignette with it — the backdrop carries its own.
      if (heroStage) {
        heroStage.style.opacity =
          (1 - smoothstep(STAGE_FADE_FROM, STAGE_FADE_TO, p)).toFixed(3);
      }

      if (heroProgress) heroProgress.style.width = (p * 100).toFixed(2) + '%';
      paintCaptions(p);
      if (heroHint) heroHint.classList.toggle('is-hidden', p > 0.015);
    }

    paintRoutes();

    // page-wide progress bar
    if (pageProgress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      pageProgress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0).toFixed(2) + '%';
    }

    if (nav) nav.classList.toggle('is-solid', window.scrollY > 60);

    requestAnimationFrame(frame);
  }

  /* ==========================================================================
     ROUTE NETWORK
     A trunk line snakes from the end of the hero down to the bottom of the
     footer, with branch stubs peeling off it. Everything starts fully
     dash-offset (invisible); the offset is driven by a "head" anchored at a
     fixed height in the viewport, so scrolling down lights the line up and
     scrolling back up unlights exactly what it drew.
     ========================================================================== */
  var ROUTE_ANCHOR = 0.66;   // where on screen the glowing head sits (0=top, 1=bottom)
  var BRANCH_SPAN  = 260;    // px of scroll a branch takes to light up fully
  var LUT_SAMPLES  = 700;    // resolution of the y -> path-length lookup

  // The trunk runs sideways exactly where two sections meet. These are the
  // elements whose top edge is a seam; they get sorted by measured position,
  // so the order written here does not matter.
  var SEAM_SELECTORS = [
    '#about', '#services', '#why', '#process', '#fleet', '.cta-band', '#contact', '.footer'
  ];
  // x the trunk sits at after each successive seam, as a fraction of page
  // width. Cycles if the page has more seams than entries.
  var CROSS_XS     = [0.15, 0.85, 0.15, 0.85, 0.30, 0.70, 0.30, 0.50];
  var SEAM_MIN_GAP = 220;   // px: seams closer together than this are skipped
  var CORNER_R     = 46;    // px: rounding on the right-angle corners
  var HORIZ_RATIO  = 0.1;   // scroll cost of sideways travel, per px of width

  // The trunk terminates at the call to action instead of running on to the
  // footer: it crosses the top of END_SECTION, turns in to END_X, then drops
  // and stops END_GAP above END_HEADING.
  var END_SECTION = '.cta-band';
  var END_HEADING = '.cta-band h2';
  var END_X       = 0.50;   // fraction of page width the final crossing ends at
  var END_GAP     = 46;     // px of clearance left above the heading

  // HORIZ_RATIO actually applied — trimmed if the full rate would push the
  // finish past the bottom of the page (see buildRoutes)
  var horizRatio = HORIZ_RATIO;

  // Branches hang off the trunk's *vertical* runs, addressed by index, so they
  // can never come adrift when the seams move:
  //   run — which vertical run (0 = the first one below the hero)
  //   t   — how far down that run, 0..1
  //   dx  — sideways reach as a fraction of page width (negative = left)
  //   dy  — how far it descends across that reach, in px
  var BRANCH_SPECS = [
    { run: 0, t: 0.55, dx:  0.30, dy: 40 },
    { run: 1, t: 0.45, dx: -0.28, dy: 40 },
    { run: 2, t: 0.55, dx:  0.26, dy: 40 },
    { run: 3, t: 0.45, dx: -0.26, dy: 40 },
    { run: 4, t: 0.50, dx:  0.24, dy: 40 }
  ];

  var lastSeams = [];   // what buildRoutes actually used, for BeeRoutes.seamReport()

  var routes    = $('#routes');
  var routeSvg  = $('#routeSvg');
  var trunkCore = null, trunkHalo = null, headEl = null;
  var branchEls = [];
  var nodeEls   = [];
  var trunkLUT  = null;

  // pull a point `r` along the segment from `a` towards `b` (for corner rounding)
  function towards(a, b, r) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var k = Math.min(r, len / 2) / len;
    return [a[0] + dx * k, a[1] + dy * k];
  }

  function roundedPath(pts, r) {
    var n = function (v) { return v.toFixed(1); };
    var d = 'M' + n(pts[0][0]) + ' ' + n(pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) {
      var a = towards(pts[i], pts[i - 1], r);
      var b = towards(pts[i], pts[i + 1], r);
      d += ' L' + n(a[0]) + ' ' + n(a[1]);
      d += ' Q' + n(pts[i][0]) + ' ' + n(pts[i][1]) + ' ' + n(b[0]) + ' ' + n(b[1]);
    }
    var last = pts[pts.length - 1];
    return d + ' L' + n(last[0]) + ' ' + n(last[1]);
  }

  // Walk the drawn path once and tabulate "virtual y" against arc length.
  // Virtual y is what the reveal is driven by: descending counts 1:1 with
  // scroll, while sideways travel costs HORIZ_RATIO of its width. Without that
  // charge a right-angle run — which has no height at all — would be revealed
  // in a single frame, and the head would teleport across it.
  function buildLUT(path) {
    var total = path.getTotalLength();
    if (!total) return null;
    var n = LUT_SAMPLES;
    var xs = new Float64Array(n + 1), ys = new Float64Array(n + 1);
    var ls = new Float64Array(n + 1), vy = new Float64Array(n + 1);
    var prev = path.getPointAtLength(0);
    xs[0] = prev.x; ys[0] = prev.y; ls[0] = 0; vy[0] = prev.y;
    for (var i = 1; i <= n; i++) {
      var len = total * i / n;
      var p = path.getPointAtLength(len);
      vy[i] = vy[i - 1] + Math.max(p.y - prev.y, 0) + Math.abs(p.x - prev.x) * horizRatio;
      xs[i] = p.x; ys[i] = p.y; ls[i] = len;
      prev = p;
    }
    return { xs: xs, ys: ys, ls: ls, vy: vy, total: total };
  }

  function lengthAtVY(lut, target) {
    var vy = lut.vy, last = vy.length - 1;
    if (target <= vy[0]) return 0;
    if (target >= vy[last]) return lut.total;
    var lo = 0, hi = last;
    while (hi - lo > 1) {
      var mid = (lo + hi) >> 1;
      if (vy[mid] <= target) lo = mid; else hi = mid;
    }
    var span = vy[hi] - vy[lo];
    var t = span > 0 ? (target - vy[lo]) / span : 0;
    return lut.ls[lo] + (lut.ls[hi] - lut.ls[lo]) * t;
  }

  // virtual y of the sampled point nearest to (x, y) — used so branches and
  // nodes switch on in step with the head rather than with raw scroll
  function vyNear(lut, x, y) {
    var best = Infinity, bi = 0;
    for (var i = 0; i < lut.xs.length; i++) {
      var dx = lut.xs[i] - x, dy = lut.ys[i] - y;
      var d = dx * dx + dy * dy;
      if (d < best) { best = d; bi = i; }
    }
    return lut.vy[bi];
  }

  function buildRoutes() {
    if (!routes || !routeSvg || !hero) return;

    var footer = document.querySelector('.footer');
    var top = hero.offsetTop + hero.offsetHeight;
    var bottom = footer ? footer.offsetTop + footer.offsetHeight
                        : document.documentElement.scrollHeight;
    var H = bottom - top;
    var W = document.documentElement.clientWidth;
    if (H <= 0 || W <= 0) return;

    routes.style.top = top + 'px';
    routes.style.height = H + 'px';
    routeSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    // The head sits at ROUTE_ANCHOR of the viewport, so at maximum scroll it
    // only reaches this far down the overlay. Everything has to fit inside it
    // for the network to be exactly complete when the page bottoms out.
    var vh = window.innerHeight || document.documentElement.clientHeight || 800;
    var reach = Math.max(H - vh * (1 - ROUTE_ANCHOR), H * 0.5);

    // pull the line in towards the centre on narrow screens so it crosses
    // less of the text
    var amp = W < 760 ? 0.66 : 1;
    var px = function (f) { return (0.5 + (f - 0.5) * amp) * W; };

    // --- where the sections meet, in overlay coordinates ------------------
    // The overlay starts at the end of the hero and is unscaled, so this is
    // just the document offset minus the overlay top. A run drawn at one of
    // these heights therefore sits exactly on the section boundary.
    var measured = [];
    SEAM_SELECTORS.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      measured.push({
        sel: sel,
        y: el.getBoundingClientRect().top + window.scrollY - top
      });
    });
    measured.sort(function (a, b) { return a.y - b.y; });

    // --- the terminus, at the call to action ------------------------------
    var endSection = document.querySelector(END_SECTION);
    var endHeading = document.querySelector(END_HEADING);
    var termSeamY = null, termStopY = null;
    if (endSection && endHeading) {
      termSeamY = endSection.getBoundingClientRect().top + window.scrollY - top;
      termStopY = endHeading.getBoundingClientRect().top + window.scrollY - top - END_GAP;
      // needs room for the corner plus a visible drop
      if (termStopY < termSeamY + CORNER_R + 12) termStopY = termSeamY + CORNER_R + 12;
      // Only give up on the terminus if the route would not have started by
      // then. If it sits lower than the anchor can reach, keep the shape anyway
      // and let the last stretch stay unlit — silently drawing a different
      // route would be worse.
      if (termSeamY < SEAM_MIN_GAP) { termSeamY = termStopY = null; }
    }

    var lastY = termSeamY != null ? termSeamY : reach;

    var kept = [];
    measured.forEach(function (m) {
      m.used = false;
      // the terminus is added separately below, and nothing crosses past it
      if (termSeamY != null && m.y >= termSeamY - SEAM_MIN_GAP) return;
      if (m.y < SEAM_MIN_GAP || m.y > lastY - SEAM_MIN_GAP) return;
      if (kept.length && m.y - kept[kept.length - 1].y < SEAM_MIN_GAP) return;
      m.used = true;
      kept.push(m);
    });
    if (termSeamY != null && endSection) {
      var termEntry = null;
      for (var mi = 0; mi < measured.length; mi++) {
        if (measured[mi].sel === END_SECTION) { termEntry = measured[mi]; break; }
      }
      if (!termEntry) { termEntry = { sel: END_SECTION, y: termSeamY }; measured.push(termEntry); }
      termEntry.used = true;
      termEntry.terminus = true;
      kept.push(termEntry);
    }
    lastSeams = measured;

    // --- turn the seams into a right-angled trunk -------------------------
    var xs = [0.5], horizWidth = 0;
    kept.forEach(function (m, k) {
      // the final crossing always ends in the middle, where the trunk stops
      var nx = m.terminus ? END_X : CROSS_XS[k % CROSS_XS.length];
      horizWidth += Math.abs(px(nx) - px(xs[k]));
      xs.push(nx);
    });

    var endY = termStopY != null ? termStopY : reach;

    // Sideways travel spends scroll budget (see buildLUT). Trim the rate if the
    // full one would push the finish past the bottom of the page.
    // never trim it all the way to zero — that would bring the teleport back
    horizRatio = horizWidth > 0
      ? clamp((reach - endY) / horizWidth, HORIZ_RATIO * 0.25, HORIZ_RATIO)
      : HORIZ_RATIO;

    var pts = [[px(0.5), 0]];
    kept.forEach(function (m, i) {
      pts.push([px(xs[i]), m.y]);        // drop down to the seam
      pts.push([px(xs[i + 1]), m.y]);    // turn 90° and run along it
    });
    pts.push([px(xs[xs.length - 1]), endY]);   // the short final drop

    var trunkD = roundedPath(pts, CORNER_R);

    var markup =
      '<path class="route-line route-trunk--halo" d="' + trunkD + '"/>' +
      '<path class="route-line route-trunk--core" d="' + trunkD + '"/>';

    // --- vertical runs, so branches always have something to hang off -----
    var runs = [];
    for (var i = 0; i < pts.length - 1; i++) {
      if (Math.abs(pts[i][0] - pts[i + 1][0]) > 0.5) continue;
      var y0 = pts[i][1] + (i === 0 ? 0 : CORNER_R);
      var y1 = pts[i + 1][1] - (i + 1 === pts.length - 1 ? 0 : CORNER_R);
      if (y1 - y0 > 40) runs.push({ x: pts[i][0], y0: y0, y1: y1 });
    }

    var branchData = [], nodeData = [];
    BRANCH_SPECS.forEach(function (b) {
      var run = runs[b.run];
      if (!run) return;
      var y1 = run.y0 + (run.y1 - run.y0) * clamp(b.t, 0, 1);
      // leave it room to finish lighting up before the page runs out
      y1 = clamp(Math.min(y1, reach - BRANCH_SPAN - 20), run.y0, run.y1);
      var x1 = run.x;
      var x2 = clamp(x1 + b.dx * W * amp, W * 0.04, W * 0.96);
      var y2 = y1 + b.dy;
      var d = 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1);
      markup += '<path class="route-line route-branch--halo" d="' + d + '"/>' +
                '<path class="route-line route-branch--core" d="' + d + '"/>';
      branchData.push({ x: x1, y: y1 });
      nodeData.push({ x: x2, y: y2, r: 4.4, branch: branchData.length - 1 });
    });

    // a marker on each trunk corner too
    for (i = 1; i < pts.length - 1; i++) {
      nodeData.push({ x: pts[i][0], y: pts[i][1], r: 3.4 });
    }
    nodeData.forEach(function (n) {
      markup += '<circle class="route-node" cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="' + n.r + '"/>';
    });

    markup +=
      '<g class="route-head" id="routeHead">' +
        '<circle class="route-head__halo" r="15"/>' +
        '<circle class="route-head__ring" r="6.5"/>' +
        '<circle class="route-head__core" r="2.9"/>' +
      '</g>';

    routeSvg.innerHTML = markup;

    trunkHalo = routeSvg.querySelector('.route-trunk--halo');
    trunkCore = routeSvg.querySelector('.route-trunk--core');
    headEl    = routeSvg.querySelector('#routeHead');

    [trunkHalo, trunkCore].forEach(function (p) {
      var L = p.getTotalLength();
      p.style.strokeDasharray = L;
      p.style.strokeDashoffset = L;
    });

    var halos = routeSvg.querySelectorAll('.route-branch--halo');
    var cores = routeSvg.querySelectorAll('.route-branch--core');
    branchEls = [];
    for (var b = 0; b < cores.length; b++) {
      var L2 = cores[b].getTotalLength();
      halos[b].style.strokeDasharray = cores[b].style.strokeDasharray = L2;
      halos[b].style.strokeDashoffset = cores[b].style.strokeDashoffset = L2;
      branchEls.push({ core: cores[b], halo: halos[b], len: L2, at: branchData[b] });
    }

    trunkLUT = buildLUT(trunkCore);

    // Switch branches and nodes on in step with the head, which means keying
    // them to virtual y rather than to raw scroll height.
    branchEls.forEach(function (b) {
      b.threshold = trunkLUT ? vyNear(trunkLUT, b.at.x, b.at.y) : b.at.y;
    });

    nodeEls = [];
    Array.prototype.forEach.call(routeSvg.querySelectorAll('.route-node'), function (el, k) {
      el.classList.remove('is-on');
      var n = nodeData[k];
      var threshold;
      if (n && n.branch != null && branchEls[n.branch]) {
        threshold = branchEls[n.branch].threshold + BRANCH_SPAN * 0.85;
      } else if (n && trunkLUT) {
        threshold = vyNear(trunkLUT, n.x, n.y);
      } else {
        threshold = n ? n.y : 0;
      }
      nodeEls.push({ el: el, threshold: threshold });
    });

    paintRoutes();
  }

  function paintRoutes() {
    if (!trunkLUT || !trunkCore) return;

    // how far the anchor line has travelled into the overlay — this is the
    // virtual-y domain the LUT was built in
    var y = window.innerHeight * ROUTE_ANCHOR - routes.getBoundingClientRect().top;
    var total = trunkLUT.total;
    var len = y <= 0 ? 0 : lengthAtVY(trunkLUT, y);
    var off = (total - len).toFixed(1);

    trunkCore.style.strokeDashoffset = off;
    trunkHalo.style.strokeDashoffset = off;

    for (var i = 0; i < branchEls.length; i++) {
      var b = branchEls[i];
      var k = clamp((y - b.threshold) / BRANCH_SPAN, 0, 1);
      var bo = (b.len * (1 - k)).toFixed(1);
      b.core.style.strokeDashoffset = bo;
      b.halo.style.strokeDashoffset = bo;
    }

    for (i = 0; i < nodeEls.length; i++) {
      nodeEls[i].el.classList.toggle('is-on', y >= nodeEls[i].threshold);
    }

    // the marker rides the lit edge the whole way, including once the line is
    // complete — it only hides before the network has been reached at all
    var live = len > 0.5;
    headEl.classList.toggle('is-on', live);
    if (live) {
      var pt = trunkCore.getPointAtLength(len);
      headEl.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ',' + pt.y.toFixed(1) + ')');
    }
  }

  /* --------------------------------------- fallback: play the clips in order */
  var fallbackWired = false;
  var fbIndex = 0;

  function runFallback() {
    body.classList.add('hero-fallback');
    // No scroll progress to drive the handover here — the clips play straight
    // through, so the stage stays fully opaque over the backdrop.
    if (heroStage) heroStage.style.opacity = '1';
    if (totalDuration === 0) return;

    function play(n) {
      fbIndex = n;
      videos.forEach(function (v, k) { v.classList.toggle('is-active', k === n); });
      chapters.forEach(function (c, k) { c.classList.toggle('is-on', k === n); });
      var v = videos[n];
      v.currentTime = 0;
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () {});
    }
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
          play((n + 1) % videos.length);
        });
      });
    }
    play(0);
  }

  /* ==========================================================================
     3. START
     ========================================================================== */
  function start() {
    measure();
    if (preloader) {
      reportProgress(100);
      setTimeout(function () { preloader.classList.add('is-done'); }, 250);
    }

    if (fallbackMode || totalDuration === 0) {
      if (totalDuration > 0) runFallback();
      if (totalDuration === 0) {
        // Nothing to show: drop the empty stage and let the hero rest on the
        // backdrop, which is the one layer that cannot fail to load.
        if (heroStage) heroStage.style.opacity = '0';
        paintCaptions(0.05);   // captions still need a resting state
      }
    } else {
      setActive(0);
      seek(videos[0], 0);
    }

    buildRoutes();
    requestAnimationFrame(frame);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(relayout, 180);
    });

    // web fonts change text heights, which moves the footer — redraw once settled
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildRoutes);
    window.addEventListener('load', buildRoutes);
  }

  /* ==========================================================================
     4. THE REST OF THE PAGE
     ========================================================================== */

  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  $$('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + 'ms';
    io.observe(el);
  });

  // animated counters
  var counterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counterIO.unobserve(e.target);
      var el = e.target;
      var to = parseFloat(el.dataset.to) || 0;
      var suffix = el.dataset.suffix || '';
      var t0 = performance.now();
      var dur = 1400;
      (function step(now) {
        var k = clamp((now - t0) / dur, 0, 1);
        var eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(to * eased) + (k === 1 ? suffix : '');
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.5 });
  $$('.count').forEach(function (el) { counterIO.observe(el); });

  // mobile nav
  var burger = $('#navBurger');
  if (burger) {
    burger.addEventListener('click', function () { nav.classList.toggle('is-open'); });
    $$('#navLinks a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); });
    });
  }

  // contact form (demo — no backend wired up)
  var form = $('#quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input[required]', form).forEach(function (input) {
        input.classList.add('is-touched');
        if (!input.value.trim()) ok = false;
      });
      if (!ok) return;
      $('#formNote').hidden = false;
      form.reset();
    });
  }

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ==========================================================================
     ROUTE TUNING HANDLE
     Lets you reshape the network live from the browser console and print the
     result back out as source you can paste into the config above.
       BeeRoutes.seams      — selectors whose top edge the trunk crosses at
       BeeRoutes.xs         — x it swings to after each seam (0..1 of width)
       BeeRoutes.branches   — [{run, t, dx, dy}, …]
       BeeRoutes.minGap     — px: seams closer than this are skipped
       BeeRoutes.corner     — px: rounding on the right-angle corners
       BeeRoutes.glide      — scroll cost of sideways travel (0 = instant)
       BeeRoutes.anchor     — where on screen the glowing head sits (0..1)
       BeeRoutes.span       — px of scroll a branch takes to light up
       BeeRoutes.rebuild()  — redraw after editing an array in place
       BeeRoutes.seamReport() — every candidate seam, measured, used or skipped
       BeeRoutes.dump()     — copy-pasteable source for main.js
     ========================================================================== */
  window.BeeRoutes = {
    get seams()    { return SEAM_SELECTORS; },
    set seams(v)   { SEAM_SELECTORS = v; buildRoutes(); },
    get xs()       { return CROSS_XS; },
    set xs(v)      { CROSS_XS = v; buildRoutes(); },
    get branches() { return BRANCH_SPECS; },
    set branches(v){ BRANCH_SPECS = v; buildRoutes(); },
    get minGap()   { return SEAM_MIN_GAP; },
    set minGap(v)  { SEAM_MIN_GAP = v; buildRoutes(); },
    get corner()   { return CORNER_R; },
    set corner(v)  { CORNER_R = v; buildRoutes(); },
    get endSection()  { return END_SECTION; },
    set endSection(v) { END_SECTION = v; buildRoutes(); },
    get endHeading()  { return END_HEADING; },
    set endHeading(v) { END_HEADING = v; buildRoutes(); },
    get endX()     { return END_X; },
    set endX(v)    { END_X = v; buildRoutes(); },
    get endGap()   { return END_GAP; },
    set endGap(v)  { END_GAP = v; buildRoutes(); },
    get glide()    { return HORIZ_RATIO; },
    set glide(v)   { HORIZ_RATIO = v; buildRoutes(); },
    get anchor()   { return ROUTE_ANCHOR; },
    set anchor(v)  { ROUTE_ANCHOR = v; buildRoutes(); },
    get span()     { return BRANCH_SPAN; },
    set span(v)    { BRANCH_SPAN = v; },
    rebuild: buildRoutes,
    seamReport: function () {
      var rows = lastSeams.map(function (m, i) {
        return {
          section: m.sel,
          yInOverlay: Math.round(m.y),
          crossesAtX: m.used ? CROSS_XS[lastSeams.filter(function (o, j) {
            return o.used && j < i;
          }).length % CROSS_XS.length] : '—',
          used: m.used
        };
      });
      if (console.table) console.table(rows); else console.log(rows);
      return rows;
    },
    dump: function () {
      var out =
        'var SEAM_SELECTORS = [\n    ' +
        SEAM_SELECTORS.map(function (s) { return "'" + s + "'"; }).join(', ') + '\n  ];\n' +
        'var CROSS_XS     = [' + CROSS_XS.map(function (x) { return x.toFixed(2); }).join(', ') + '];\n' +
        'var SEAM_MIN_GAP = ' + SEAM_MIN_GAP + ';\n' +
        'var CORNER_R     = ' + CORNER_R + ';\n' +
        'var HORIZ_RATIO  = ' + HORIZ_RATIO + ';\n' +
        "var END_SECTION = '" + END_SECTION + "';\n" +
        "var END_HEADING = '" + END_HEADING + "';\n" +
        'var END_X       = ' + END_X + ';\n' +
        'var END_GAP     = ' + END_GAP + ';\n' +
        'var BRANCH_SPECS = [\n' +
        BRANCH_SPECS.map(function (b) {
          return '    { run: ' + b.run + ', t: ' + b.t + ', dx: ' + b.dx + ', dy: ' + b.dy + ' }';
        }).join(',\n') + '\n  ];\n' +
        'var ROUTE_ANCHOR = ' + ROUTE_ANCHOR + ';\n' +
        'var BRANCH_SPAN  = ' + BRANCH_SPAN + ';';
      console.log(out);
      return out;
    }
  };

  /* go */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
