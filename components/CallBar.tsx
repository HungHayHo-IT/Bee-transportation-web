
import { QuoteLink } from '@/components/QuoteLink';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { contactPhones } from '@/lib/representatives';

/**
 * Fixed action bar, phone only.
 *
 * In freight the urgent enquiry is a phone call, not a form — and on a narrow
 * screen the nav's quote button is hidden and the hotline only appears on the
 * contact page and in the footer. This puts both within thumb reach on every
 * page. Targets are sized past the 44px minimum (WCAG 2.5.5).
 */
export async function CallBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  // The first representative on the list — the same number the footer leads
  // with, so the thumb-reach button and the footer never disagree.
  const [hotline] = contactPhones(dict.site);

  return (
    // Thanh gọi nổi là một phần của khung điều hướng — xem Nav.tsx.
    <div className="callbar" data-cms-region="nav">
      <a className="callbar__btn callbar__btn--call" href={hotline!.href}>
        <span aria-hidden="true" className="callbar__icon" />
        {dict.nav.callNow}
      </a>
      {/* Carries the service when the reader is on one of its pages — see
          QuoteLink. */}
      <QuoteLink locale={locale} className="callbar__btn callbar__btn--quote">
        {dict.nav.cta}
      </QuoteLink>
    </div>
  );
}
