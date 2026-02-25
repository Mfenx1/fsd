type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const VALID = ['light', 'dark', 'system'] as const;
const isValid = (t: string): t is ThemePreference =>
  (VALID as readonly string[]).includes(t);


export const parseThemeCookie = (raw: string | undefined): ThemePreference => {
  if (!raw) return 'system';
  const trimmed = raw.trim();
  if (isValid(trimmed)) return trimmed;
  try {
    const parsed = JSON.parse(trimmed);
    if (isValid(parsed.theme)) return parsed.theme;
  } catch (_) {}

  return 'system';
};


export const resolveThemeServer = (preference: ThemePreference): ResolvedTheme => {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';

  return 'light';
};

export type { ThemePreference, ResolvedTheme };