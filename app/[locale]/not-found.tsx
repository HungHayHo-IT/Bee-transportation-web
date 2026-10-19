import Link from 'next/link';

import { DEFAULT_LOCALE } from '@/lib/i18n/config';
import { pathFor } from '@/lib/routes';

/**
 * Rendered inside the locale layout, so it keeps the nav and footer.
 *
 * A not-found boundary is not given the route params, so it cannot know which
 * language the visitor was in. The copy is therefore Vietnamese — the default
 * the rest of the site redirects to — rather than a guess. If the English site
 * ever needs its own wording, this becomes a page that reads the locale from
 * the pathname instead.
 */
export default function NotFound() {
  return (
    <main id="top" className="page">
      <section className="section">
        <div className="wrap sec-head">
          <div className="eyebrow">
            <i />
            404
          </div>
          <h1 className="h2">
            Không tìm thấy <span className="hl">trang này</span>
          </h1>
          <p className="lead lead--center">
            Đường dẫn không còn tồn tại hoặc đã được đổi.
          </p>
          <p>
            <Link className="btn btn--primary" href={pathFor('home', DEFAULT_LOCALE)}>
              Về trang chủ
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
