'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import type { Locale } from '@/lib/i18n/config';
import { quotePath, serviceKeyFromPath } from '@/lib/routes';

/**
 * A link to the quote form that carries the service the reader is on.
 *
 * The thumb bar this is for lives in the layout, which is handed the locale and
 * nothing else, so which service page the reader is looking at has to be read
 * back off the URL — and that needs the client. The header does the same thing
 * inline, since it is already a client component with the pathname to hand.
 */
export function QuoteLink({
  locale,
  className,
  children,
}: {
  locale: Locale;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link className={className} href={quotePath(locale, serviceKeyFromPath(pathname, locale))}>
      {children}
    </Link>
  );
}
