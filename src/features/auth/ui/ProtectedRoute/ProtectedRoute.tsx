'use client';

import { useEffect } from 'react';
import { PageSkeleton, useRouterAdapter, ROUTES } from '$shared';
import { useAuth } from '$features/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  const routerAdapter = useRouterAdapter();

  useEffect(() => {
    if (!token && !isLoading && routerAdapter) {
      routerAdapter.navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [token, isLoading, routerAdapter]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!token) {
    return <PageSkeleton />;
  }

  return <>{children}</>;
};