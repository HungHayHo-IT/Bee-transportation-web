import Image from 'next/image';
import type { ReactNode } from 'react';

import { InView } from '@/components/InView';
import type { NamedBody } from '@/lib/i18n/types';
import type { ImageProps } from '@/lib/image-slots';

/**
 * Reasons to trust the company, ticked off beside the claim.
 *
 * Shared, because two pages open the same argument with different evidence:
 * the warehousing page ticks off how the warehouses are run, a service page its
 * own selling points. Neither the count nor the length of the points is fixed —
 * they are spread down the panel, so three long ones and four short ones both
 * fill it.
 */
export function UspSlide({
  title,
  accent,
  items,
  aside,
  bgImage,
}: {
  title: string;
  accent: string;
  items: readonly NamedBody[];
  /**
   * Anything that belongs under the claim. The left column is a heading and
   * then a lot of nothing, and a page with more evidence to show puts it here
   * rather than in a section of its own.
   */
  aside?: ReactNode;
  /**
   * Ảnh nền, đã giải sẵn: có thể là ảnh CMS thay hoặc ảnh trong repo. Nhận
   * props thay vì tự import vì component này không nhận `dict`.
   */
  bgImage: ImageProps;
}) {
  return (
    <InView as="section" className="slide-light usps">
      <div className="wrap usps__panel">
        {/* Decorative, and almost entirely veiled — see .usps__panel */}
        <Image
          {...bgImage}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="usps__img"
        />

        <div className="usps__grid">
          <div className="usps__claim page-slide__in">
            <h2 className="usps__title">
              {title} <span className="usps__accent">{accent}</span>
            </h2>
            {aside}
          </div>

          <dl className="usps__list page-slide__in page-slide__in--late">
            {items.map((item) => (
              <div className="usps__item" key={item.name}>
                <dt>
                  <svg
                    className="usps__tick"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <circle cx="12" cy="12" r="12" />
                    <path d="M7 12.4l3.2 3.2L17 8.8" />
                  </svg>
                  {item.name}
                </dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </InView>
  );
}
