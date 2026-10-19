/**
 * Locale segments deliberately match the URL shape the previous site used
 * (`/vi-vn`, `/en-us`), so inbound links and existing search results keep
 * resolving after the cutover.
 */
export const LOCALES = ['vi-vn', 'en-us'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'vi-vn';

/** The `lang` attribute and hreflang value for each locale segment. */
export const HTML_LANG: Record<Locale, string> = {
  'vi-vn': 'vi-VN',
  'en-us': 'en-US',
};

/** Shown in the language switcher. */
export const LOCALE_LABEL: Record<Locale, string> = {
  'vi-vn': 'Tiếng Việt',
  'en-us': 'English',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
