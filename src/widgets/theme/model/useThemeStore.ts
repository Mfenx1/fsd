'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { THEME_COOKIE } from '$shared';
import {
  type ThemePreference,
  type ResolvedTheme,
  resolveTheme,
  getStoredTheme,
} from './themeSlice';

export interface ThemeSlice {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const VALID_THEMES = ['light', 'dark', 'system'] as const;
type ValidTheme = (typeof VALID_THEMES)[number];

const isValidTheme = (t: unknown): t is ValidTheme =>
  typeof t === 'string' && VALID_THEMES.includes(t as ValidTheme);


const themeStorage = createJSONStorage<{ state: { theme: ThemePreference } }>(() => ({
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    const fromCookie = getStoredTheme();
    const fromLs = localStorage.getItem(name);
    if (fromCookie !== 'system') {
      return JSON.stringify({ state: { theme: fromCookie } });
    }
    return fromLs;
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, value);
    try {
      const parsed = JSON.parse(value) as { state?: { theme?: string } };
      const theme = parsed?.state?.theme;
      if (isValidTheme(theme)) {
        void fetch(`/api/set-theme?theme=${encodeURIComponent(theme)}`, {
          credentials: 'include',
        });
      }
    } catch {
      
    }
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
    void fetch('/api/set-theme?theme=system', { credentials: 'include' });
  },
}));

export const useThemeStore = create<ThemeSlice>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme: ThemePreference) => {
        set({ theme });
        applyResolvedTheme(resolveTheme(theme));
      },
    }),
    { name: THEME_COOKIE, storage: themeStorage }
  )
);

export const applyResolvedTheme = (resolved: ResolvedTheme) => {
  if (typeof document === 'undefined') return;
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};