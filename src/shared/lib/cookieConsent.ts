const COOKIE_CONSENT_NAME = 'cookie_consent';
const MAX_AGE_YEAR = 60 * 60 * 24 * 365;

export const CONSENT = {
  ALL: 'all',
  NECESSARY: 'necessary',
  CUSTOM: 'custom',
} as const;

export type ConsentValue = (typeof CONSENT)[keyof typeof CONSENT];


export type ConsentCategories = {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export const DEFAULT_CATEGORIES: ConsentCategories = {
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false,
};

export const NECESSARY_ONLY: ConsentCategories = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const ALL_CATEGORIES: ConsentCategories = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

const isClient = typeof window !== 'undefined';

function parseCustomCategories(raw: string | undefined): ConsentCategories | null {
  if (!raw || !raw.startsWith('{')) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentCategories>;
    if (typeof parsed?.necessary !== 'boolean') return null;
    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

function getRawConsent(): string | null {
  if (!isClient) return null;
  const raw = document.cookie
    .match(new RegExp(`(?:^|; )${COOKIE_CONSENT_NAME}=([^;]*)`))?.[1];
  return raw ? decodeURIComponent(raw) : null;
}


export const getCookieConsent = (): ConsentValue | null => {
  const value = getRawConsent();
  if (!value) return null;
  if (value === CONSENT.ALL || value === CONSENT.NECESSARY) return value;
  if (value === CONSENT.CUSTOM || value.startsWith(CONSENT.CUSTOM + ':'))
    return CONSENT.CUSTOM;
  if (value.startsWith('{')) return CONSENT.CUSTOM;
  return null;
};


export const getConsentCategories = (): ConsentCategories => {
  const raw = getRawConsent();
  if (!raw) return NECESSARY_ONLY;
  if (raw === CONSENT.ALL) return ALL_CATEGORIES;
  if (raw === CONSENT.NECESSARY) return NECESSARY_ONLY;
  const json = raw.startsWith(CONSENT.CUSTOM + ':')
    ? raw.slice((CONSENT.CUSTOM + ':').length)
    : raw.startsWith('{')
      ? raw
      : null;
  const custom = json ? parseCustomCategories(json) : null;
  return custom ?? NECESSARY_ONLY;
};

export const setCookieConsent = (
  value: ConsentValue | ConsentCategories
): void => {
  if (!isClient) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  const stored =
    typeof value === 'object'
      ? CONSENT.CUSTOM + ':' + JSON.stringify(value)
      : value;
  document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(stored)}; path=/; max-age=${MAX_AGE_YEAR}; SameSite=Lax${secure}`;
};