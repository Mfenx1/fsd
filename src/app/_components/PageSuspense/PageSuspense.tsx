'use client';

import { Suspense } from 'react';
import { PageSkeleton } from '$shared';

type PageSuspenseProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};


export const PageSuspense = ({ children, fallback = <PageSkeleton /> }: PageSuspenseProps) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);