'use client';

import { createContext, useContext } from 'react';

export interface RouterAdapterContextValue {
  navigate: (to: string, options?: { replace?: boolean }) => void;
  
  prefetch: (href: string) => void;
  location: { pathname: string; state?: { from?: { pathname: string } } };
}

export const RouterAdapterContext = createContext<RouterAdapterContextValue | null>(
  null
);

export const useRouterAdapter = (): RouterAdapterContextValue | null =>
  useContext(RouterAdapterContext);