'use client';

import { useCallback, useMemo, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RouterAdapterContext } from './routerAdapterContext';


export const NextRouterAdapterProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    },
    [router]
  );

  const prefetch = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router]
  );

  const location = useMemo(
    () => ({ pathname: pathname ?? '/', state: undefined }),
    [pathname]
  );

  const value = useMemo(
    () => ({ navigate, prefetch, location }),
    [navigate, prefetch, location]
  );

  return (
    <RouterAdapterContext.Provider value={value}>
      {children}
    </RouterAdapterContext.Provider>
  );
};