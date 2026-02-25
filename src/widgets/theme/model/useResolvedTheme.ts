'use client';

import { useSyncExternalStore } from 'react';
import { useThemeStore } from './useThemeStore';
import type { ResolvedTheme } from './themeSlice';

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  mq.addEventListener('change', cb);

  return () => mq.removeEventListener('change', cb);
};

export const useResolvedTheme = (): ResolvedTheme => {
  const theme = useThemeStore((s) => s.theme);
  const prefersDark = useSyncExternalStore(
    subscribe,
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false 
  );
  if (theme === 'light') return 'light';
  if (theme === 'dark') return 'dark';

  return prefersDark ? 'dark' : 'light';
};