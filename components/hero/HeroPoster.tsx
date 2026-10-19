import Image from 'next/image';

import { imageProps } from '@/lib/image-slots';
import type { Dictionary } from '@/lib/i18n';

/**
 * The hero's first paint — and the proposal for C-04.
 *
 * The old opening was a full-screen preloader that covered everything until
 * all four clips had downloaded: on 4G a visitor watched a percentage counter
 * for several seconds before seeing a single word. Nothing about the page was
 * the Largest Contentful Paint because nothing was painted.
 *
 * This is the reverse. The first frame of v1 is a real <img>, served by
 * next/image as AVIF/WebP at the right size and marked `priority` so it is
 * preloaded in the document head — which makes it the LCP element, arriving in
 * one round trip rather than after 3.8MB. The headline sits on top of it and
 * is readable immediately.
 *
 * The clips then load behind it. `data-loading` carries progress so the bar
 * along the bottom can show it without covering anything, and the engine sets
 * `is-ready` on the section when the video can take over — at which point this
 * layer fades out. If the video never loads, this stays, and the hero is a
 * poster with a headline on it rather than a broken loading screen.
 */
export function HeroPoster({ dict }: { dict: Dictionary }) {
  const first = dict.hero.captions[0];

  return (
    <div className="poster" id="heroPoster">
      <Image
        {...imageProps('heroPoster', dict.images)}
        alt=""
        className="poster__img"
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={72}
      />
      <div className="poster__scrim" aria-hidden="true" />

      {/* A duplicate of caption 1, painted immediately. Hidden from the
          accessibility tree because the real <h1> lives in the overlays below
          and must not be announced twice. */}
      <div className="poster__copy" aria-hidden="true">
        <div className="cap__eyebrow">
          <i />
          {first.eyebrow}
        </div>
        <p className="poster__title">
          {first.title} <span>{first.titleAccent}</span>
        </p>
        <p className="poster__sub">{first.sub}</p>
      </div>

      <div className="poster__foot">
        <div className="poster__bar" aria-hidden="true">
          <i id="preloadFill" />
        </div>
        <p className="poster__status" role="status" aria-live="polite">
          <span className="poster__note">{dict.preloader.note}</span>
          <span className="poster__pct">
            <span id="preloadPct">0</span>%
          </span>
        </p>
      </div>
    </div>
  );
}
