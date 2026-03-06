'use client';

import { useEffect } from 'react';
import { useThemeStore, applyResolvedTheme, resolveTheme } from './model';
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyResolvedTheme(resolveTheme(theme));

    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyResolvedTheme(resolveTheme('system'));
    mq.addEventListener('change', handler);

    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return <>{children}</>;
};