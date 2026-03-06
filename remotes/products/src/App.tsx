import { useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Products } from '$features';
import { queryKeys } from '$features/products/model';
import { useProductsTableStore } from '$features/products/model';
import { useProductsUIStore } from '$features/products/model';
import type { QueryClient as QueryClientType } from '@tanstack/react-query';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    },
  });

export interface ProductsAppProps {
    queryClient?: QueryClientType;
    initialData?: { products: unknown[]; total: number; skip: number; limit: number };
    searchParams?: { q?: string; sortBy?: string; order?: 'asc' | 'desc' };
}

export const ProductsApp = ({
  queryClient: hostQueryClient,
  initialData,
  searchParams,
}: ProductsAppProps) => {
  const queryClient = useMemo(() => {
    const client = hostQueryClient ?? createQueryClient();
    if (initialData) {
      const sortBy = searchParams?.sortBy ?? 'title';
      const order = searchParams?.order ?? 'asc';
      const query = searchParams?.q?.trim() || undefined;
      client.setQueryData(queryKeys.products.list({ sortBy, order, query }), {
        pages: [initialData],
        pageParams: [0],
      });
    }
    return client;
  }, [hostQueryClient, initialData, searchParams?.sortBy, searchParams?.order, searchParams?.q]);

  useEffect(() => {
    if (searchParams) {
      if (searchParams.sortBy && searchParams.order) {
        useProductsTableStore.getState().setSort(searchParams.sortBy, searchParams.order);
      }
      if (searchParams.q !== undefined) {
        useProductsUIStore.getState().setSearch(searchParams.q ?? '');
      }
    }
  }, [searchParams]);

  return (
    <QueryClientProvider client={queryClient}>
      <Products embedded={!!initialData} />
    </QueryClientProvider>
  );
};