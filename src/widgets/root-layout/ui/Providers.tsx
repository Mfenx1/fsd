'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, NextRouterAdapterProvider } from '$shared';
import { useAuthSync } from '$features';
import {
  useGlobalQueryErrorHandler,
  GlobalToastView,
  CookieConsentBanner,
  ThemeProvider,
  useThemeStore,
  type ThemePreference,
} from '$widgets';

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then((m) => ({
      default: m.ReactQueryDevtools,
    })),
  { ssr: false, loading: () => null }
);

const DevtoolsClientOnly = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);
  return mounted ? <ReactQueryDevtools initialIsOpen={false} /> : null;
};

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

const AuthAndErrorSync = ({ children }: { children: ReactNode }) => {
  useAuthSync();
  useGlobalQueryErrorHandler();

  return <>{children}</>;
};

export const Providers = ({
  children,
  initialThemePref,
}: {
  children: ReactNode;
  initialThemePref?: ThemePreference;
}) => {
  const [queryClient] = useState(makeQueryClient);
  const themeSyncDone = useRef(false);
  
  
  if (initialThemePref != null && !themeSyncDone.current) {
    themeSyncDone.current = true;
    useThemeStore.setState({ theme: initialThemePref });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NextRouterAdapterProvider>
        <ErrorBoundary>
          <AuthAndErrorSync>
          <ThemeProvider>
          <CookieConsentBanner />
          <GlobalToastView />
          {children}
          </ThemeProvider>
        </AuthAndErrorSync>
        </ErrorBoundary>
      </NextRouterAdapterProvider>
      <DevtoolsClientOnly />
    </QueryClientProvider>
  );
};