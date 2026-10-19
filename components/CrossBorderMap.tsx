import Image from 'next/image';

import type { ImageProps } from '@/lib/image-slots';

/**
 * BEE's own route map, lifted from the company profile deck (slide 11): the
 * ten numbered lanes, the Vietnamese branch network, and the brand's markers
 * at each hub. The numbers on it are the numbers in the lane list beside it.
 *
 * Presented as a plate rather than dropped straight onto the page. The source
 * is a transparent PNG whose labels outside the landmass — TAIWAN, HOANG SA
 * ISLANDS, TRUONG SA ISLANDS, Penang, Kuala Lumpur, Singapore — are dark text,
 * invisible against this site's near-black ground. Repainting someone else's
 * cartography was the wrong answer (the island labels in particular are
 * deliberate), so the map keeps its own light ground and the page frames it as
 * a figure: a caption strip names it, a rule separates it from the page, and
 * the plate is warm off-white rather than a bright rectangle punched out of the
 * dark.
 *
 * The lane list beside this carries the same information as real text, so
 * nothing here is load-bearing for search or for a screen reader.
 */
export function CrossBorderMap({
  alt,
  caption,
  source,
  image,
}: {
  alt: string;
  /**
   * Names the figure. Both are optional: on a slide where the map is the whole
   * left half and the lanes are ruled out beside it, the plate needs no strip
   * telling the reader what it is looking at.
   */
  caption?: string;
  source?: string;
  /** Ảnh bản đồ, đã giải sẵn — component này không nhận `dict`. */
  image: ImageProps;
}) {
  return (
    <figure className="mapfig">
      {caption && (
        <figcaption className="mapfig__cap">
          <span className="mapfig__title">{caption}</span>
          {source && <span className="mapfig__note">{source}</span>}
        </figcaption>
      )}
      <div className="mapfig__plate">
        <Image
          {...image}
          alt={alt}
          className="mapfig__img"
          sizes="(max-width: 1000px) 100vw, 1160px"
          loading="eager"
        />
      </div>
    </figure>
  );
}
