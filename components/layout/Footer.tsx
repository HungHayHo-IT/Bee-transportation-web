import Image from 'next/image';
import Link from 'next/link';

import { FooterOffices, MailIcon, PhoneIcon } from '@/components/layout/FooterOffices';
import { SocialLinks } from '@/components/SocialLinks';
import { Year } from '@/components/Year';
import type { Dictionary } from '@/lib/i18n';
import logoLockup from '@/public/img/logo-lockup-white.png';
import type { Locale } from '@/lib/i18n/config';
import { NAV_KEYS, pathFor } from '@/lib/routes';
import { HEADER_LINKS, entryHref, entryId, entryLabel } from '@/lib/navigation';
import { danhSachDichVu } from '@/lib/service-listing';
import { contactPhones } from '@/lib/representatives';
import { ORG } from '@/lib/site';


/** Company pages listed under "Company": everything in the nav except the two that have their own column. */
/** Pages under "Company". Warehousing and the cross-border page are listed
 *  under services now, as they are in the header — see lib/navigation.ts. */
const COMPANY_KEYS = NAV_KEYS.filter(
  (key) => key !== 'services' && key !== 'contact' && key !== 'warehousing' && key !== 'crossborder',
);

export async function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = dict.site;
  // One row per representative BeeOps has switched on; falls back to the
  // number in lib/site.ts when that list is unavailable — see contactPhones.
  const phones = contactPhones(dict.site);
  const [before, after] = dict.footer.copyright.split('{year}');
  const afterYear = (after ?? '').replace('{name}', 'Bee Transportation');

  return (
    // Chân trang chép lại tên các mục điều hướng, nên đoán theo nội dung sẽ
    // ra "vùng này là thanh điều hướng". Khai thẳng — xem Nav.tsx.
    <footer className="footer" data-cms-region="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href={pathFor('home', locale)} aria-label={s.shortName}>
              {/* The white-ink lockup: this sits on the dark ground, where the
                  truck head and the strapline in the standard artwork are a
                  near-black that all but disappears.

                  The full horizontal lockup here — the one place on the page
                  wide enough to carry the wordmark and the strapline at a size
                  where they can still be read. The header keeps the compact
                  mark instead, since at 30px this artwork would reduce
                  "TRANSPORTATION CORP" to an unreadable smear.

                  alt is empty on purpose: the link around it already carries
                  aria-label, so describing the image too would have a screen
                  reader announce the company name twice.

                  Below the fold on every page, so it loads lazily. */}
              <Image
                src={logoLockup}
                alt=""
                sizes="(max-width: 860px) 220px, 200px"
                className="footer__logo"
              />
            </Link>

            {/* Dưới logo: chỗ quen thuộc nhất, và là cột duy nhất ở chân trang
                không phải một danh sách liên kết. */}
            <SocialLinks dict={dict} />
          </div>

          <div className="footer__col">
            <h4>{dict.footer.servicesHeading}</h4>
            {/* The header's order: its own links first, then the menu. */}
            {HEADER_LINKS.map((entry) => (
              <Link key={entryId(entry)} href={entryHref(entry, locale)}>
                {entryLabel(entry, dict)}
              </Link>
            ))}
            {/* ĐỦ mọi dịch vụ của menu Dịch vụ (feedback 15/10/2026) — cắt còn ba
                là khách đọc chân trang tưởng công ty chỉ làm năm việc. */}
            {danhSachDichVu(dict, locale).map((m) => (
              <Link key={m.key} href={m.href}>
                {m.name}
              </Link>
            ))}
          </div>

          <div className="footer__col">
            <h4>{dict.footer.companyHeading}</h4>
            {COMPANY_KEYS.map((key) => (
              <Link key={key} href={pathFor(key, locale)}>
                {dict.nav[key]}
              </Link>
            ))}
          </div>

          <div className="footer__col">
            <h4>{dict.footer.supportHeading}</h4>
            <Link href={pathFor('privacy', locale)}>{dict.footer.privacyLabel}</Link>
            <Link href={pathFor('terms', locale)}>{dict.footer.termsLabel}</Link>
          </div>

          <div className="footer__col footer__contact">
            <h4>{dict.footer.contactHeading}</h4>
            {/* Cùng kiểu với trang Liên hệ: văn phòng theo nhóm, rồi hotline
                và email chung — xem FooterOffices. */}
            <FooterOffices offices={s.offices} locale={locale} />
            <div className="footer__group">
              <p className="footer__groupLabel">{dict.contact.labels.hotline}</p>
              {phones.map((p) => (
                <div className="footer__row" key={p.key}>
                  <PhoneIcon />
                  <a href={p.href}>
                    <span data-cms-attr="site.phoneNumber">{p.display}</span>
                    {p.name ? <> ({p.name})</> : null}
                  </a>
                </div>
              ))}
            </div>
            <div className="footer__group">
              <p className="footer__groupLabel">{dict.contact.labels.email}</p>
              <div className="footer__row">
                <MailIcon />
                <a href={`mailto:${s.email}`}>{s.email}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bar">
          {/* Năm và tên điền vào giữa nên trên trang là ba nút chữ — đối chiếu
              theo chữ không nhận ra; khai thẳng tên ô. */}
          <span
            data-cms-attr="footer.copyright"
            data-cms-fill={JSON.stringify({ year: String(new Date().getFullYear()), name: 'Bee Transportation' })}
          >
            {before}
            <Year buildYear={new Date().getFullYear()} />
            {afterYear}
          </span>
        </div>
      </div>
    </footer>
  );
}
