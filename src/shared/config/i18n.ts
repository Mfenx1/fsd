export const LOCALE_COOKIE = 'locale';
export const SUPPORTED_LOCALES = ['ru', 'en'] as const;
export const DEFAULT_LOCALE = 'ru' as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const isSupportedLocale = (value: string): value is Locale =>
  SUPPORTED_LOCALES.includes(value as Locale);