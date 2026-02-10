import { useCallback, useMemo } from 'react';
import { useProductsInfiniteQuery } from './useProductsInfiniteQuery';
import { useProductsTableSort, useProductsUIStore } from '$store';
import { SEARCH_DEBOUNCE_MS } from '$constants';
import { useDebouncedValue } from '../useDebouncedValue';

export const useProductsQuery = () => {
  const search = useProductsUIStore((s) => s.search);
  const searchDebounced = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const { sortBy, order } = useProductsTableSort();

  const queryParams = useMemo(
    () => ({
      query: searchDebounced || undefined,
      sortBy,
      order,
    }),
    [searchDebounced, sortBy, order]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    error,
    isError,
  } = useProductsInfiniteQuery(queryParams);

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data?.pages]
  );

  const total = data?.pages[0]?.total ?? 0;

  const errorMessage =
    isError && error
      ? error instanceof Error
        ? error.message
        : 'Ошибка загрузки товаров'
      : null;

  const onLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return useMemo(
    () => ({
      products,
      total,
      loading: isLoading,
      errorMessage,
      hasMore: products.length < total,
      loadingMore: isFetchingNextPage,
      onLoadMore,
      onRefetch: refetch,
    }),
    [
      products,
      total,
      isLoading,
      errorMessage,
      isFetchingNextPage,
      onLoadMore,
      refetch,
    ]
  );
};
