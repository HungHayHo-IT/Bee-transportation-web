import Image from 'next/image';
import type { ReactNode } from 'react';

import { Counter } from '@/components/Counter';
import { CrossBorderMap } from '@/components/CrossBorderMap';
import { InView } from '@/components/InView';
import { Reveal } from '@/components/Reveal';
import { UspSlide } from '@/components/UspSlide';
import { WarehouseTypes as WarehouseTypesSlide } from '@/components/WarehouseTypes';
import { imageProps } from '@/lib/image-slots';
import type { Dictionary } from '@/lib/i18n';
import { HTML_LANG, type Locale } from '@/lib/i18n/config';
import { ORG } from '@/lib/site';

/**
 * Sections built from the company profile deck: warehousing, the cross-border
 * network, GPS tracking, lifting, and customs brokerage.
 *
 * They live apart from the sections ported off the old static site so it stays
 * obvious which copy came from where — everything here traces to
 * profile-betransport.pptx and is figures rather than prose.
 */

type Props = { locale: Locale; dict: Dictionary };

export function CrossBorder({ dict }: { dict: Dictionary }) {
  const c = dict.crossborder;

  return (
    <section className="section crossborder" id="crossborder">
      <div className="wrap">
        {/* The name, the claim and the lead are the hero's — see
            CrossBorderHero. This section picks up from why road wins here. */}
        <Reveal className="pill-row">
          {c.benefits.map((benefit) => (
            <span className="pill" key={benefit}>
              {benefit}
            </span>
          ))}
        </Reveal>

        <Reveal className="sec-sub">
          <h2 className="h3">{c.corridorsHeading}</h2>
        </Reveal>
        <div className="why__grid why__grid--3">
          {c.corridors.map((corridor, i) => (
            <Reveal key={corridor.name} delayIndex={i} className="why__item">
              <b>{corridor.name}</b>
              <p>{corridor.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Tracking({ dict }: { dict: Dictionary }) {
  const t = dict.tracking;

  return (
    <section className="section tracking" id="tracking">
      <div className="wrap fleet__grid">
        <Reveal>
          <div className="eyebrow">
            <i />
            {t.eyebrow}
          </div>
          <h2 className="h2">
            {t.title} <span className="hl">{t.titleAccent}</span>
          </h2>
          <p className="body">{t.lead}</p>
        </Reveal>

        <Reveal as="ul" className="tick-list">
          {t.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Lifting({ dict }: { dict: Dictionary }) {
  const l = dict.lifting;

  return (
    <section className="section lifting" id="lifting">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">
            <i />
            {l.eyebrow}
          </div>
          <h2 className="h2">
            {l.title} <span className="hl">{l.titleAccent}</span>
          </h2>
          <p className="lead lead--center">{l.lead}</p>
        </Reveal>

        <div className="why__grid why__grid--2">
          {l.special.map((item, i) => (
            <Reveal key={item.name} delayIndex={i} className="why__item">
              <b>{item.name}</b>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="sec-sub">
          <h3 className="h3">{l.equipmentHeading}</h3>
        </Reveal>
        <Reveal className="pill-row">
          {l.equipment.map((item) => (
            <span className="pill" key={item}>
              {item}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Customs({ dict }: { dict: Dictionary }) {
  const c = dict.customs;

  return (
    <section className="section customs" id="customs">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">
            <i />
            {c.eyebrow}
          </div>
          <h2 className="h2">
            {c.title} <span className="hl">{c.titleAccent}</span>
          </h2>
          <p className="lead lead--center">{c.lead}</p>
          {/* A verifiable number does more for trust than any adjective. */}
          <p className="licence">
            {c.licenceLabel}: <strong>{dict.site.customsLicence}</strong>
          </p>
        </Reveal>

        <Reveal className="sec-sub">
          <h3 className="h3">{c.slaHeading}</h3>
        </Reveal>
        <div className="sla-row">
          {c.sla.map((item, i) => (
            <Reveal key={item.name} delayIndex={i} className="sla">
              <b>{item.name}</b>
              <span>{item.body}</span>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="note">{c.slaNote}</p>
        </Reveal>

        <Reveal className="sec-sub">
          <h3 className="h3">{c.scopeHeading}</h3>
        </Reveal>
        <Reveal className="pill-row">
          {c.scope.map((item) => (
            <span className="pill" key={item}>
              {item}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The warehousing page's opening slide: the yard filling the screen, the
 * section's name and what it covers below it, and the headline figures on
 * glass across the foot of the frame.
 *
 * Shares the page hero's chrome with the service pages — see PAGE HERO in the
 * stylesheet — and only adds the row of figures.
 *
 * The copy is `eyebrow` and `lead` rather than new strings: those already say
 * exactly what the comp puts here, and the section below no longer repeats
 * them.
 */
export function WarehouseHero({
  locale,
  dict,
  trail,
}: Props & {
  /**
   * The breadcrumb trail. It rides in the hero on a page built entirely of
   * slides: a strip of its own between two of them is never rested on, since
   * the page snaps and 65px is not a screen.
   */
  trail?: ReactNode;
}) {
  const w = dict.warehousing;

  return (
    <section className="page-hero warehouse-hero">
      {/* Decorative: the yard fills the frame and darkens towards the bottom of
          its own accord, which is the ground the copy sits on. `priority`
          because this is the page's largest paint. */}
      <Image
        {...imageProps('warehouseBg', dict.images)}
        alt=""
        fill
        sizes="100vw"
        priority
        className="page-hero__img"
      />
      <div className="page-hero__panel">
        <div className="wrap">
          <div className="page-hero__inner warehouse-hero__head">
            <h1 className="page-hero__title">{w.eyebrow}</h1>
            <p className="page-hero__lead">{w.lead}</p>
          </div>

          <dl className="warehouse-hero__stats">
            {w.overview.map((stat) => (
              <div className="warehouse-hero__stat" key={stat.label}>
                <dt>
                  <Counter
                    to={stat.to}
                    suffix={stat.suffix}
                    localeTag={HTML_LANG[locale]}
                  />
                </dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>

          {trail && <div className="page-hero__trail">{trail}</div>}
        </div>
      </div>
    </section>
  );
}

/**
 * The three functional warehouses, shown one at a time on a slide of their own.
 *
 * The photographs go through next/image rather than a CSS background: as a
 * background Next cannot touch them, so a 550px-wide frame was being served
 * the full 1728px source. They are handed to the slide rather than imported
 * there, so the slider stays a slider and the assets stay with the section.
 */
const WAREHOUSE_SLOTS = ['warehouseType1', 'warehouseType2', 'warehouseType3'];

export function WarehouseTypes({ dict }: { dict: Dictionary }) {
  const w = dict.warehousing;

  return (
    <WarehouseTypesSlide
      heading={w.typesHeading}
      lead={
        <p className="warehouse-types__lead">
          {w.title} <span className="warehouse-types__accent">{w.titleAccent}</span>{' '}
          {w.titleTail}
        </p>
      }
      houses={w.warehouses}
      photos={WAREHOUSE_SLOTS.map((slot) => imageProps(slot, dict.images))}
      label={w.eyebrow}
    />
  );
}

/**
 * Why the warehousing operation is worth trusting: how the warehouses are
 * actually run, on the shared slide — see components/UspSlide.tsx. The section
 * below no longer lists these separately.
 */
export function WarehouseTrust({ dict }: { dict: Dictionary }) {
  return (
    <UspSlide
      bgImage={imageProps('uspsBg', dict.images)}
      title={dict.trust.title}
      accent={dict.trust.titleAccent}
      items={dict.warehousing.tech}
      aside={
        <div className="usps__aside">
          <h3 className="usps__aside-title">{dict.warehousing.infraHeading}</h3>
          <ul className="usps__aside-list">
            {dict.warehousing.infra.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      }
    />
  );
}

/**
 * The cross-border page's opening slide. The same hero as the service and
 * warehousing pages — see PAGE HERO in the stylesheet — with a line of its own
 * above the lead, because this page's subtitle is a claim rather than a label.
 */
export function CrossBorderHero({
  dict,
  trail,
}: {
  dict: Dictionary;
  /** Rides in the hero for the same reason it does on warehousing. */
  trail?: ReactNode;
}) {
  const c = dict.crossborder;

  return (
    <section className="page-hero">
      {/* Decorative: the frame darkens towards its own bottom, which is the
          ground the copy sits on. `priority` — it is the largest paint here. */}
      <Image
        {...imageProps('borderBg', dict.images)}
        alt=""
        fill
        sizes="100vw"
        priority
        className="page-hero__img"
      />
      <div className="page-hero__panel">
        <div className="wrap">
          <div className="page-hero__inner">
            <h1 className="page-hero__title">{c.eyebrow}</h1>
            <div className="page-hero__copy">
              <p className="page-hero__kicker">
                {c.title} {c.titleAccent} {c.titleTail}
              </p>
              <p className="page-hero__lead">{c.lead}</p>
            </div>
          </div>

          {trail && <div className="page-hero__trail">{trail}</div>}
        </div>
      </div>
    </section>
  );
}

/**
 * The route network: BEE's own map on its plate, with the ten numbered lanes
 * ruled out beside it. The numbers on the map are the numbers in the list, so
 * the two have to be readable together — which is why they share a screen here
 * rather than sitting one above the other.
 */
export function CrossBorderRoutes({ dict }: { dict: Dictionary }) {
  const c = dict.crossborder;

  return (
    <InView as="section" className="page-slide border-routes">
      <div className="wrap border-routes__grid">
        <div className="border-routes__figure page-slide__in">
          <CrossBorderMap alt={c.mapAlt} image={imageProps('crossBorderMap', dict.images)} />
        </div>

        {/* Ordered, because the deck numbers these and a quotation refers to a
            lane by its number. The marker carries the number; the square beside
            it is the comp's bullet. */}
        <ol
          className="border-routes__list page-slide__in page-slide__in--late"
          aria-label={c.routesHeading}
        >
          {c.routes.map((route) => (
            <li key={route}>{route}</li>
          ))}
        </ol>
      </div>
    </InView>
  );
}

/**
 * The three corridors the lanes group into, each with a photograph over it.
 *
 * The photograph for each goes through next/image rather than a CSS
 * background: as a background Next cannot touch it, so a 380px-wide frame was
 * being served the full 1728px source — see CORRIDOR_PHOTOS below.
 */
const CORRIDOR_SLOTS = ['corridor1', 'corridor2', 'corridor3'];

export function CrossBorderCorridors({ dict }: { dict: Dictionary }) {
  const c = dict.crossborder;

  return (
    <InView as="section" className="slide-light corridors">
      <div className="wrap">
        <h2 className="corridors__heading page-slide__in">{c.corridorsHeading}</h2>

        <ul className="corridors__grid page-slide__in page-slide__in--late">
          {c.corridors.map((corridor, i) => (
            <li className="corridors__card" key={corridor.name}>
              <div className="corridors__figure">
                {/* Decorative: the corridor is named and described beside it. */}
                <Image
                  {...imageProps(CORRIDOR_SLOTS[i] ?? 'corridor1', dict.images)}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                  placeholder="blur"
                  className="corridors__img"
                />
              </div>
              <h3 className="corridors__name">{corridor.name}</h3>
              <p className="corridors__body">{corridor.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </InView>
  );
}
