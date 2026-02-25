import { parseThemeCookie, THEME_COOKIE } from '$shared';

export type ThemePreference = 'light' | 'dark' | 'system';

export type ResolvedTheme = 'light' | 'dark';

const getCookieValue = (name: string): string | undefined => {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  );

  const value = match?.[1];

  return value != null ? decodeURIComponent(value) : undefined;
};


export const getStoredTheme = (): ThemePreference => {
  if (typeof window === 'undefined') return 'system';

  const raw = getCookieValue(THEME_COOKIE);

  return parseThemeCookie(raw);
};

export const resolveTheme = (preference: ThemePreference): ResolvedTheme => {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};