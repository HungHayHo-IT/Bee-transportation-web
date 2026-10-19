import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

import { Counter } from '@/components/Counter';
import { InView } from '@/components/InView';
import { QuoteForm } from '@/components/QuoteForm';
import { Reveal } from '@/components/Reveal';
import { ServiceRail } from '@/components/ServiceRail';
import type { Dictionary } from '@/lib/i18n';

export { Team } from './Team';
export { AppDownload, HomeFaq } from './AppFaq';
import { HTML_LANG, type Locale } from '@/lib/i18n/config';
import { pathFor, quotePath } from '@/lib/routes';
import { danhSachDichVu } from '@/lib/service-listing';
import { type KhoaDichVu, type ServiceKey } from '@/lib/services';
import { contactPhones } from '@/lib/representatives';
import { imageProps } from '@/lib/image-slots';
import { fetchPartnerLogos, type PartnerLogo } from '@/lib/partner-logos';
import { ORG } from '@/lib/site';
import ctaTruck from '@/public/img/cta-truck.jpg';
import { lienLacRieng, linkBanDo, nhanNhom, vanPhongHien } from '@/lib/offices';
import { MailIcon, PhoneIcon } from '@/components/layout/FooterOffices';

/**
 * The page sections, one component each, sharing the class names the
 * stylesheet already uses. They take the dictionary rather than reading it
 * themselves so the same section can be dropped onto the home page and onto
 * its own dedicated page without either knowing about locales.
 */

type SectionProps = { locale: Locale; dict: Dictionary };

/**
 * Which heading element a section leads with. Every page needs exactly one
 * <h1>, and these sections are reused both as the top of a page and partway
 * down the home page, so the page decides rather than the section.
 */
type Leads = { as?: 'h1' | 'h2' };

export function Marquee({ dict }: { dict: Dictionary }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {/* Two copies: the track scrolls one full copy's width and repeats. */}
        <span>{dict.marquee}&nbsp;</span>
        <span>{dict.marquee}&nbsp;</span>
      </div>
    </div>
  );
}


/**
 * The home page's opening statement: who the company is and what it promises,
 * on a light full-screen slide between the hero and the call to action. The
 * dark About section above is the one the /about page uses; this is a
 * different, much shorter piece of copy and deliberately not shared with it.
 */
export function AboutIntro({ dict }: { dict: Dictionary }) {
  return (
    <InView as="section" id="about" className="slide-light about-intro">
      <div className="wrap about-intro__inner">
        <p className="about-intro__line">{dict.about.intro.founding}</p>
        <p className="about-intro__line">
          <em className="about-intro__motto">{dict.about.intro.motto}</em>{' '}
          {dict.about.intro.mottoTail}
        </p>
      </div>
    </InView>
  );
}

/**
 * The second half of the home introduction: a photograph beside the service
 * promise and the three figures worth quoting.
 *
 * The photograph is public/img/about-yard.jpg. It replaced the flat grey plate
 * this section was laid out against, so the shape here is the shape it was
 * designed for — nothing needs adjusting for the real image.
 */
export function AboutDetail({ locale, dict }: SectionProps) {
  return (
    <InView as="section" className="slide-light about-detail">
      <div className="wrap about-detail__grid">
        <div className="about-detail__figure">
          <Image
            {...imageProps('aboutYard', dict.images)}
            alt={dict.about.detail.imageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 48vw"
            loading="eager"
            className="about-detail__img"
          />
        </div>

        <div className="about-detail__body">
          <p className="about-detail__lead">{dict.about.body}</p>

          <dl className="about-detail__facts">
            {dict.about.detail.highlights.map((item) => (
              <div className="fact" key={item.body}>
                <dt>
                  <Counter
                    to={item.to}
                    suffix={item.suffix}
                    localeTag={HTML_LANG[locale]}
                  />
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

/**
 * DỰ PHÒNG — danh sách logo khi không lấy được từ BeeOps.
 *
 * Logo giờ quản lý ở màn CMS (thêm, xoá, bật/tắt) và đến từ
 * /landing/partner-logos. Danh sách này chỉ để trang chủ không bao giờ trống
 * vì backend chớp một nhịp; nó cũng là dữ liệu nạp sẵn của migration 073.
 *
 * Logo của hai dải đối tác, theo thứ tự hiện. Tệp nằm ở public/img/logos/.
 *
 * Ảnh raster đã được làm sẵn: bỏ nền trắng đặc, cắt sát, thu về cao 64px —
 * gấp đôi chiều cao hiện 32px cho màn hình mật độ cao. Thay logo thì giữ cách
 * làm đó, không thì một tấm 2000px sẽ đi nguyên về trình duyệt.
 */
/** Tỉ lệ rộng/cao đo trên phần NỘI DUNG của logo, đã bỏ khoảng trống thừa. */
type Logo = readonly [file: string, name: string, ratio: number];

/**
 * Chiều cao hiện của một logo, cân theo DIỆN TÍCH chứ không theo chiều cao.
 *
 * Cùng cao 32px thì logo dài như Kansai Felt (8,9:1) chiếm gấp chín lần chỗ
 * của một logo vuông như Unilever — mắt đọc cái đầu là "to", cái sau là "bé
 * xíu". Giữ diện tích bằng nhau thì logo dài thấp xuống, logo vuông cao lên,
 * và cả dải trông đều. Hằng số chọn để logo tỉ lệ 3,5:1 — loại phổ biến nhất
 * ở đây — vẫn cao đúng 32px như thiết kế.
 */
const DIEN_TICH = 32 * 32 * 3.5;
const caoLogo = (ratio: number): number =>
  Math.round(Math.min(52, Math.max(20, Math.sqrt(DIEN_TICH / ratio))));

const CUSTOMERS: readonly Logo[] = [
  ['01-kone.svg', 'KONE', 2.59],
  ['04-unilever.svg', 'Unilever', 0.91],
  ['05-wiha.webp', 'Wiha', 3.52],
  ['06-gl-tech-gloveland.webp', 'GL Tech Gloveland', 2.44],
  ['07-unops.svg', 'UNOPS', 6.84],
  ['08-tekcom.webp', 'Tekcom', 5.75],
  ['10-iko.webp', 'IKO', 2.97],
  ['11-comin-asia.svg', 'Comin Asia', 3.85],
  ['13-yazaki.webp', 'Yazaki', 7.23],
  ['14-nipro.svg', 'Nipro', 3.85],
  ['17-austrong.webp', 'Austrong', 4.5],
  ['18-vietnam-airlines.svg', 'Vietnam Airlines', 2.71],
  ['19-garco10-may10.webp', 'Garco 10', 1.97],
  ['20-vinatex.webp', 'Vinatex', 1.3],
  ['21-ls-vina-cable.webp', 'LS-VINA Cable', 7.54],
  ['22-vinaconex-vector.svg', 'Vinaconex', 1.89],
  ['23-daisen-sangyo.webp', 'Daisen Sangyo', 5.56],
  ['24-goertek.webp', 'Goertek', 4.57],
  ['26-corteva-ex-dupont-pioneer.webp', 'Corteva', 5.06],
  ['27-kumho-tire.webp', 'Kumho Tire', 3.8],
  ['28-autel.webp', 'Autel', 6.12],
  ['31-fujikura-composites.svg', 'Fujikura Composites', 1.35],
  ['34-sl-corporation.webp', 'SL Corporation', 2.27],
  ['35-yageo-group.webp', 'Yageo Group', 5.02],
  ['37-amtran.webp', 'Amtran', 6.78],
  ['38-vinfast.webp', 'VinFast', 5.11],
  ['40-idemitsu.webp', 'Idemitsu', 4.92],
  ['41-tai-yuen-textile.webp', 'Tai Yuen Textile', 3.98],
  ['43-greenworks.svg', 'Greenworks', 4.86],
  ['44-canadian-solar.webp', 'Canadian Solar', 6.52],
  ['45-wolong.webp', 'Wolong', 3.58],
  ['46-kansai-felt.webp', 'Kansai Felt', 8.88],
  ['47-lg-display.webp', 'LG Display', 4.97],
  ['48-pioneer.svg', 'Pioneer', 6.78],
];

const MEMBERSHIPS: readonly Logo[] = [
  ['01-fiata.webp', 'FIATA', 1.02],
  ['02-iata.svg', 'IATA', 1.6],
  ['03-wca-world.webp', 'WCA World', 1.98],
  ['04-wca-pharma.webp', 'WCA Pharma', 1.77],
  ['05-wca-projects.webp', 'WCA Projects', 1.72],
  ['06-gla-global-logistics-alliance.webp', 'GLA Global Logistics Alliance', 2.91],
  ['07-tala.webp', 'TALA', 3.67],
  ['08-global-air-cargo-alliance.webp', 'Global Air Cargo Alliance', 4.42],
  ['09-jctrans-trang.webp', 'JCtrans', 4.17],
  ['10-project-cargo-network.webp', 'Project Cargo Network', 2.32],
  ['11-gpln.webp', 'GPLN', 4.35],
  ['12-eaa-network.webp', 'EAA Network', 2.19],
  ['13-neptune-forwarding.webp', 'Neptune Forwarding', 4.52],
  ['14-vcci.webp', 'VCCI', 2.95],
  ['15-vla.svg', 'VLA', 1.0],
  ['16-pangea.svg', 'Pangea', 3.02],
  ['17-millennium-logistics-network.webp', 'Millennium Logistics Network', 3.53],
];

/**
 * Một dải logo chạy ngang không dứt.
 *
 * Danh sách được VẼ HAI LẦN nối tiếp nhau, và cả dải trượt đúng một nửa chiều
 * dài của nó rồi quay lại điểm đầu: lúc quay lại, bản thứ hai nằm đúng chỗ bản
 * thứ nhất vừa đứng, nên mắt không thấy chỗ nối. Bản thứ hai ẩn khỏi trình đọc
 * màn hình — nghe tên mỗi hãng hai lần không giúp ai.
 *
 * Tốc độ tính theo SỐ Ô (biến --n), nên hai dải dài ngắn khác nhau vẫn trôi
 * cùng một nhịp.
 */
/** Danh sách dựng sẵn ở dạng giống hệt dữ liệu BeeOps trả về. */
const DU_PHONG: PartnerLogo[] = [
  ...CUSTOMERS.map(([file, name, ratio]) => ({
    group: 'customer' as const, name, ratio, imageUrl: `/img/logos/customers/${file}`,
  })),
  ...MEMBERSHIPS.map(([file, name, ratio]) => ({
    group: 'membership' as const, name, ratio, imageUrl: `/img/logos/membership/${file}`,
  })),
];

function LogoRow({
  title, dir, items, localeTag,
}: {
  title: string;
  localeTag: string;
  dir: 'right' | 'left';
  items: readonly PartnerLogo[];
}) {
  // Tắt hết logo của một nhóm thì bỏ cả dải lẫn con số — "0+" trên trang chủ
  // tệ hơn không có gì.
  if (items.length === 0) return null;
  return (
    <div className="logo-row">
      {/* Khối số liệu: số lớn là SỐ LOGO của dải — đếm từ danh sách, nên thêm
          bớt logo thì số tự đúng — và đếm lên một lần khi cuộn tới, như các số
          ở khối giới thiệu. Dòng dưới là chú thích, sửa được ở CMS. */}
      <div className="logo-row__stat">
        <p className="logo-row__num">
          <Counter to={items.length} suffix="+" localeTag={localeTag} />
        </p>
        <p className="logo-row__title">{title}</p>
      </div>
      <div className="logo-row__view">
        <ul
          className={`logo-row__track logo-row__track--${dir}`}
          style={{ '--n': items.length } as CSSProperties}
        >
          {[...items, ...items].map(({ imageUrl, name, ratio }, i) => {
            const banSao = i >= items.length;
            return (
              <li className="logo-row__cell" key={i} aria-hidden={banSao || undefined}>
                {/* <img> chứ không phải next/image: phần lớn là SVG, trình tối
                    ưu không đụng tới, còn ảnh raster đã thu nhỏ sẵn. Eager vì
                    cùng lý do với ảnh nền của dải — xem ở dưới. */}
                <img
                  src={imageUrl}
                  alt={banSao ? '' : name}
                  height={caoLogo(ratio)}
                  style={{ height: caoLogo(ratio) }}
                  loading="eager"
                  decoding="async"
                  className="logo-row__mark"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/**
 * The partner band: the service promise held over a night road, with two
 * running rows of logos beneath it — customers drifting left to right, the
 * networks BEE is a member of drifting the other way.
 *
 * The band carries no heading by design, so the section is named for assistive
 * technology instead.
 */
export async function Partners({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const logo = (await fetchPartnerLogos()) ?? DU_PHONG;
  return (
    <InView as="section" className="partners" aria-label={dict.partners.label}>
      {/* Decorative: the road occupies the lower half, the night sky above it
          is what the copy sits on. Eager for the same reason as the CTA band —
          the hero engine drives the scroll, so lazy loading never fires here. */}
      <Image
        {...imageProps('partnerRoad', dict.images)}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        className="partners__img"
      />
      <div className="wrap partners__inner">
        <div className="partners__rows">
          <LogoRow
            title={dict.partners.customers} dir="right"
            items={logo.filter((l) => l.group === 'customer')} localeTag={HTML_LANG[locale]}
          />
          <LogoRow
            title={dict.partners.membership} dir="left"
            items={logo.filter((l) => l.group === 'membership')} localeTag={HTML_LANG[locale]}
          />
        </div>
      </div>
    </InView>
  );
}


/**
 * The home page's run through the nine services: a row of cards that scrolls
 * sideways, first to last, each showing a photograph, its name, its number
 * and a way through to the detail page. Hovering or focusing a card lifts it
 * and slides the row so that it is wholly in view with a slice of the cards
 * on either side showing; on a phone the card a swipe comes to rest on in the
 * middle is the lifted one — see ServiceRail. Cuộn dọc với con trỏ trên hàng
 * thẻ thì lướt qua hàng thẻ trước, mỗi nấc chuột một thẻ vào giữa màn hình;
 * tới thẻ cuối thì cử chỉ sau mới sang slide tiếp. Con trỏ ở chỗ khác trên
 * slide thì sang slide luôn.
 *
 * One face only. The cards used to turn over on hover to show three scope
 * points; the flip is gone, and the points now sit on the face itself, in a
 * panel at the foot of the card over a darkened photograph. With a mouse the
 * panel opens as the card is selected; on a touch screen, where nothing can be
 * hovered, it is always open — key information is never hover-only.
 *
 * Separate from `Services` below, which is the services page's own section and
 * stays a plain grid.
 */
/** How many of a service's scope points fit on a card. */
const POINTS_ON_CARD = 3;

export function ServicesSlide({ locale, dict }: SectionProps) {
  // Mục Dịch vụ gồm những gì — cùng danh sách với menu và chân trang. Số hiệu
  // trên thẻ chạy theo chỗ đứng đang hiện, không gắn cứng vào khoá.
  const muc = danhSachDichVu(dict, locale);

  // data-cms-region: khối này mượn tên trang Kho bãi (nav.warehousing) cho tấm
  // thẻ cuối, nên đếm ô để đoán sẽ ra "vùng này thuộc thanh điều hướng", và
  // chọn Thanh điều hướng sẽ lôi cả hàng thẻ dịch vụ lên theo.
  return (
    <InView
      as="section"
      id="services"
      className="slide-light services-slide"
      data-cms-region="services"
    >
      <div className="services-slide__inner">
        <div className="wrap">
          <h2 className="services-slide__title">{dict.services.slideTitle}</h2>
        </div>

        <ServiceRail label={dict.services.railLabel}>
          {muc.map((m, i) => {
            const soHieu = String(i + 1).padStart(2, '0');
            return (
              <li className="svc-card" key={m.key}>
                <div className="svc-card__inner">
                  <div className="svc-face">
                    <Image
                      {...imageProps(m.anh, dict.images)}
                      alt=""
                      fill
                      sizes="(max-width: 620px) 80vw, 288px"
                      className="svc-face__img"
                    />
                    {/* aria-hidden: the link's label already names the card. */}
                    <span className="svc-face__name" aria-hidden="true">
                      {m.name}
                    </span>
                    <div className="svc-face__panel">
                      {m.points.length > 0 && (
                        <div className="svc-face__more">
                          <ul className="svc-face__points">
                            {m.points.slice(0, POINTS_ON_CARD).map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <span className="svc-face__foot" aria-hidden="true">
                        <span className="svc-face__no">{soHieu}</span>
                        <span className="svc-face__cta">
                          {dict.services.cardCta}
                          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M5 12h12M13 6l6 6-6 6" />
                          </svg>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* The whole card is the link, named by its label; the scope
                    points on the face are read out as a list of their own. */}
                <Link
                  className="svc-card__link"
                  href={m.href}
                  aria-label={`${m.name} — ${dict.services.cardCta}`}
                />
              </li>
            );
          })}
        </ServiceRail>
      </div>
    </InView>
  );
}


export function Why({ dict }: { dict: Dictionary }) {
  return (
    <section className="section why" id="why">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">
            <i />
            {dict.why.eyebrow}
          </div>
          <h2 className="h2">
            {dict.why.title} <span className="hl">{dict.why.titleAccent}</span>
          </h2>
        </Reveal>

        <div className="why__grid">
          {dict.why.items.map((item, i) => (
            <Reveal key={item.name} delayIndex={i} className="why__item">
              <b>{item.name}</b>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


export function Fleet({ locale, dict, as: H = 'h2' }: SectionProps & Leads) {
  return (
    <section className="section fleet" id="fleet">
      <div className="wrap fleet__grid">
        <Reveal>
          <div className="eyebrow">
            <i />
            {dict.fleet.eyebrow}
          </div>
          <H className="h2">
            {dict.fleet.title} <span className="hl">{dict.fleet.titleAccent}</span>{' '}
            {dict.fleet.titleTail}
          </H>
          <p className="body">{dict.fleet.body}</p>
          <Link className="btn btn--primary" href={pathFor('contact', locale)}>
            {dict.fleet.cta}
          </Link>
        </Reveal>

        <Reveal as="ul" className="fleet__list">
          {dict.fleet.items.map((item) => (
            <li key={item.name}>
              <b>{item.name}</b>
              <span>{item.spec}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function CtaBand({

  locale,

  dict,

  service,

}: SectionProps & {

  /**

   * The service the band is sitting under, when it is on a service page.

   * It rides along to the quote form, which opens with it chosen.

   */

  service?: KhoaDichVu;

}) {
  return (
    // Khối chủ thương hiệu giữ lại: backend chặn mọi khoá ctaBand.*, nên chế
    // độ sửa cũng phải để yên nó. Không khai vùng thì chữ trên nút ở đây trùng
    // đúng chữ nút của hero, và trình sửa gán nhầm nó thành ô hero.cta — bấm
    // vào sửa ở đây lại đổi nút bên hero.
    <section className="cta-band" data-cms-region="ctaBand">
      {/* Decorative: the truck on the bridge sits in the top half, the copy in the dark lower half. */}
      {/* Eager on purpose: the hero engine drives the scroll, so the browser's
          lazy-load heuristics never fire for this image on the home page and
          only the blur placeholder would ever show. */}
      <Image
        src={ctaTruck}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        placeholder="blur"
        className="cta-band__img"
      />
      <Reveal className="wrap cta-band__inner">
        <h2>{dict.ctaBand.title}</h2>
        <p>{dict.ctaBand.body}</p>
        <Link className="btn btn--cta btn--lg" href={quotePath(locale, service)}>
          {dict.ctaBand.cta}
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M5 12h12M13 6l6 6-6 6" />
          </svg>
        </Link>
      </Reveal>
    </section>
  );
}

export async function Contact({
  locale,
  dict,
  as: H = 'h2',
  trail,
}: SectionProps &
  Leads & {
    /**
     * The breadcrumb trail. It rides inside this section on the contact page:
     * the screen opens on a full-bleed photograph, so a band of page ground
     * above it would only push the photo down — same reasoning as the two
     * hero pages. See app/[locale]/[slug]/page.tsx.
     */
    trail?: ReactNode;
  }) {
  const s = dict.site;
  // Same list the footer shows — one entry per representative BeeOps has
  // switched on, falling back to the number in the dictionary (CMS sửa được)
  // when that list is unavailable.
  const phones = contactPhones(s);

  return (
    <section className="section contact" id="contact">
      {/* Decorative: the yard behind the copy. This section is the contact
          page's first screen and carries its <h1>, so the photograph is the
          largest paint above the fold, so it loads with priority rather than
          lazily. */}
      <Image
        {...imageProps('contactBg', dict.images)}
        alt=""
        fill
        sizes="100vw"
        priority
        className="contact__img"
      />
      <div className="wrap contact__grid">
        <Reveal>
          {trail && <div className="contact__trail">{trail}</div>}
          <div className="eyebrow">
            <i />
            {dict.contact.eyebrow}
          </div>
          <H className="h2">
            {dict.contact.title} <span className="hl">{dict.contact.titleAccent}</span>
          </H>

          <div className="info">
            {/* Mỗi văn phòng một dòng, nhãn đi kèm từng văn phòng. Trước
                đây là hai khối viết tay cho trụ sở và chi nhánh — thêm văn
                phòng thứ ba khi đó phải sửa mã nguồn. */}
            {vanPhongHien(s.offices).map((vp) => {
              const rieng = lienLacRieng(vp);
              return (
                <div className="info__row" key={`${vp.street}-${vp.city}`}>
                  <span className="info__label">{nhanNhom(vp.label, locale)}</span>
                  <p>
                    {/* Bấm là mở Google Maps ở tab mới — xem linkBanDo. */}
                    <a href={linkBanDo(vp)} target="_blank" rel="noopener noreferrer">
                      {vp.street}, {vp.city}
                    </a>
                  </p>
                  {/* Số / email riêng của văn phòng, nếu CMS có điền — xem lienLacRieng. */}
                  {rieng.phone || rieng.email ? (
                    <p className="info__sub">
                      {rieng.phone ? (
                        <a href={rieng.phone.href}>
                          <PhoneIcon />
                          <span data-cms-attr={`site.offices.${s.offices.indexOf(vp)}.phone`}>
                            {rieng.phone.display}
                          </span>
                        </a>
                      ) : null}
                      {rieng.email ? (
                        <a href={`mailto:${rieng.email}`}>
                          <MailIcon />
                          {rieng.email}
                        </a>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              );
            })}
            <div className="info__row">
              <span className="info__label">{dict.contact.labels.hotline}</span>
              <p>
                {/* One line per representative BeeOps has switched on. Number
                    and name are one target: the label used to sit outside the
                    link, which put a dead half right beside the live one on
                    exactly the control someone is reaching for. */}
                {phones.map((phone, i) => (
                  <span key={phone.key}>
                    {i > 0 && <br />}
                    <a href={phone.href}>
                      <span data-cms-attr="site.phoneNumber">{phone.display}</span>
                      {phone.name ? <> - {phone.name}</> : null}
                    </a>
                  </span>
                ))}
              </p>
            </div>
            <div className="info__row">
              <span className="info__label">{dict.contact.labels.email}</span>
              <p>
                <a href={`mailto:${s.email}`}>{s.email}</a>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <QuoteForm locale={locale} dict={dict} phone={phones[0]!} />
        </Reveal>
      </div>
    </section>
  );
}
