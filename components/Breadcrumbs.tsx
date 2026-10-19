import Link from 'next/link';

import { JsonLd } from '@/components/JsonLd';
import type { Locale } from '@/lib/i18n/config';
import { pathFor } from '@/lib/routes';
import { ORG, SITE_URL } from '@/lib/site';

export type Crumb = { name: string; href?: string };

/**
 * Visible breadcrumb plus its BreadcrumbList, from one list — so the trail a
 * reader sees and the trail a search engine reads can never disagree. The last
 * crumb carries no link and no `item`: it is the page you are on.
 */
export function Breadcrumbs({
  locale,
  trail,
  label,
}: {
  locale: Locale;
  trail: Crumb[];
  label: string;
}) {
  const home: Crumb = { name: ORG.shortName, href: pathFor('home', locale) };
  const all = [home, ...trail];

  return (
    <>
      <nav className="crumbs" aria-label={label}>
        {all.map((crumb, i) => (
          <span key={crumb.name} className="crumbs__item">
            {i > 0 && (
              <span className="crumbs__sep" aria-hidden="true">
                /
              </span>
            )}
            {crumb.href ? (
              <Link href={crumb.href}>{crumb.name}</Link>
            ) : (
              <span aria-current="page">{crumb.name}</span>
            )}
          </span>
        ))}
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((crumb, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: crumb.name,
            ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
