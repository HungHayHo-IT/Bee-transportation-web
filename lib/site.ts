/**
 * Facts about the company that are not copy — they appear in structured data,
 * in metadata and in the contact block, and must not drift between them.
 */

/**
 * Canonical origin. Vercel exposes the deployment URL, but only the production
 * domain may be used for canonical/sitemap URLs or preview deployments would
 * advertise themselves to search engines.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://beetransportation.vn';

export const ORG = {
  name: 'BEE TRANSPORTATION Corporation',
  shortName: 'BEE TRANSPORTATION',
  founded: '2023-11-08',
  email: 'info@beetransportation.vn',
  /** Customs agent licence — verifiable, so it belongs in the footer. */
  customsLicence: '2569/HQHCM-GSQL',
  /**
   * THE DEFAULT CONTACT — what every contact point shows when the
   * representative list from BeeOps has not arrived.
   *
   * It is used whenever that list cannot be relied on: BEEOPS_API_URL not
   * configured, the request failing, or the list coming back empty. See
   * contactPhones() in lib/representatives.ts.
   *
   * `number` is written the way it is dialled in Vietnam, leading zero and
   * all, because that is the form a reader recognises and the form `tel:`
   * gets. `e164` exists only for JSON-LD, where schema.org wants the
   * international form. There is deliberately no pre-formatted display string
   * here: lib/representatives.ts derives it, so the fallback and a number that
   * came from the backend can never end up written two different ways.
   *
   * Two numbers were listed until 10/09/2026; Mr. Richard's line (+84 938 339
   * 112) was retired that day and must not be reinstated. The company profile
   * deck also carries a Da Nang landline (+84 2369 995 272) which was already
   * stale before that — likewise do not reinstate it from the deck.
   */
  phones: [
    { label: 'Mr. Tiger', number: '0886440449', e164: '+84886440449' },
  ],
  offices: [
    {
      type: 'headquarters' as const,
      street: 'TTC Tower, 253 Hoàng Văn Thụ, Phường Tân Sơn Hoà',
      city: 'Thành phố Hồ Chí Minh',
      country: 'VN',
    },
    {
      type: 'branch' as const,
      street: '386 Xô Viết Nghệ Tĩnh, Phường Khuê Trung, Quận Cẩm Lệ',
      city: 'Đà Nẵng',
      country: 'VN',
    },
  ],
};

/**
 * The hero clip chain, in play order. Durations are what ffprobe reports on the
 * encoded files; the scrub engine reads the real values back off the decoded
 * video, so these are only used for the preload budget shown to the user.
 */
export const HERO_CLIPS = [
  '/video/v1.mp4',
  '/video/v2.mp4',
  '/video/v3.mp4',
  '/video/v4.mp4',
] as const;

