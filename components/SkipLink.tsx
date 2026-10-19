import type { Dictionary } from '@/lib/i18n';

/**
 * WCAG 2.4.1. First thing in the tab order, invisible until focused. Without
 * it a keyboard or screen-reader user crosses six nav items, the language
 * switcher and the CTA on every page — and on the home page lands in front of
 * the hero film.
 */
export function SkipLink({ dict }: { dict: Dictionary }) {
  return (
    <a className="skip" href="#top">
      {dict.nav.skipToContent}
    </a>
  );
}
