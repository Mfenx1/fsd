'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useResolvedTheme } from '$widgets';
import { ProductsLoaderSkeleton } from './ProductsLoaderSkeleton';
import { RemoteFromRegistry } from '../loader';


export const ProductsRemoteLoader = () => {
  const queryClient = useQueryClient();
  const theme = useResolvedTheme();

  return (
    <RemoteFromRegistry
      remoteName="products"
      fallback={<ProductsLoaderSkeleton />}
      mountProps={{ queryClient, theme }}
    />
  );
};