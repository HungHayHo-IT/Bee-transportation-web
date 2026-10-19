import Image from 'next/image';

import { InView } from '@/components/InView';
import { ProcessSlide } from '@/components/ProcessSlide';
import { UspSlide } from '@/components/UspSlide';
import type { Dictionary } from '@/lib/i18n';
import type { KhoaDichVu } from '@/lib/services';
import { imageProps } from '@/lib/image-slots';

/**
 * The sections a service page is built from. Every service runs through the
 * same sequence and differs only in its copy, so each of these takes the
 * service key and reads its own entry out of the dictionary rather than being
 * handed the pieces one at a time.
 */

/**
 * The opening slide: the fleet shot filling the screen, with the service's name
 * and what it is for held on the dark ground the photograph already carries
 * along its bottom edge.
 *
 * This is the page's <h1> — the section below it deliberately no longer has
 * one, and its lead paragraph is this one.
 */
export function ServiceHero({
  dict,
  service,
}: {
  dict: Dictionary;
  service: KhoaDichVu;
}) {
  const entry = dict.services.items[service];

  return (
    <section className="page-hero">
      {/* Decorative: the truck fills the upper two thirds and the copy sits on
          the ground below it. `priority` because this is the page's largest
          paint and nothing above it competes. */}
      <Image
        {...imageProps('serviceIntroBg', dict.images)}
        alt=""
        fill
        sizes="100vw"
        priority
        className="page-hero__img page-hero__img--truck"
      />
      {/* The copy carries its own ground rather than trusting the photo's:
          how far down the frame the horizon falls depends on the shape of the
          screen, and on a wide one it lands below where the copy starts. */}
      <div className="page-hero__panel">
        <div className="wrap page-hero__inner">
          <h1 className="page-hero__title">{entry.name}</h1>
          <p className="page-hero__lead">{entry.intro}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * What goes wrong for a shipper without this service: the figure on the left,
 * the three problems ruled down the right.
 *
 * The figure is the service's own photograph — the same file the home page
 * shows on its card, see SERVICE_PHOTOS in lib/service-photos.ts. Through
 * next/image rather than as a CSS background, for the responsive sizes a
 * photograph this large wants. A key with no file falls back to the frame's
 * own plate colour rather than to a broken image.
 */
export function ServiceProblems({
  dict,
  service,
}: {
  dict: Dictionary;
  service: KhoaDichVu;
}) {
  const entry = dict.services.items[service];

  return (
    <InView as="section" className="page-slide service-problems">
      <div className="wrap service-problems__grid">
        <div className="service-problems__figure page-slide__in">
          {/* Decorative: the problems beside it are what the section says, and
              the photograph only says which service they belong to. */}
          {/* LUÔN vẽ ảnh, kể cả dịch vụ người dùng tự thêm — ô ảnh của nó tự
              rơi về tấm chung của trang dịch vụ (xem imageProps). Trước đây
              khối này chỉ vẽ khi có ảnh nằm sẵn trong mã nguồn, nên trang của
              dịch vụ mới hở hẳn một nửa màn hình trong khi chín trang cũ thì
              không — cùng một khuôn mà ra hai hình hài. */}
          <Image
            {...imageProps(`service.${service}`, dict.images)}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 44vw"
            className="service-problems__img"
          />
        </div>

        <div className="page-slide__in page-slide__in--late">
          <h2 className="page-slide__title">{entry.problemsHeading ?? dict.services.problemsHeading}</h2>
          {/* A description list: each problem is a name and what it costs, and
              that pairing is what the markup should say. */}
          <dl className="service-problems__list">
            {entry.problems.map((item) => (
              <div className="service-problems__item" key={item.name}>
                <dt>{item.name}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </InView>
  );
}

/**
 * How the work is actually run, one step at a time. The number of steps differs
 * from service to service — three for some, four for others — and the road
 * below draws a stop for each, so nothing here needs to know which.
 */
export function ServiceProcess({
  dict,
  service,
}: {
  dict: Dictionary;
  service: KhoaDichVu;
}) {
  return (
    <ProcessSlide
      heading={dict.services.items[service].approachHeading ?? dict.services.approachHeading}
      steps={dict.services.items[service].approach}
      images={dict.images}
    />
  );
}

/**
 * Why this service is worth trusting: its own three selling points, on the
 * shared slide — see components/UspSlide.tsx.
 */
export function ServiceUsps({
  dict,
  service,
}: {
  dict: Dictionary;
  service: KhoaDichVu;
}) {
  return (
    <UspSlide
      bgImage={imageProps('uspsBg', dict.images)}
      title={dict.trust.title}
      accent={dict.trust.titleAccent}
      items={dict.services.items[service].usps}
    />
  );
}
