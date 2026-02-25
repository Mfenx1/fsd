import { useInfiniteQuery } from '@tanstack/react-query';
import { isOk, throwApiError } from '$shared';
import { fetchProducts } from '$features/products/api';
import type { ProductsQueryParams, ProductsResponse } from '$entities/product';
import { DEFAULT_PRODUCTS_QUERY_PARAMS } from '$entities/product';
import { queryKeys } from '..';

const fetchProductsPage = async ({
  pageParam = 0,
  queryKey,
}: {
  pageParam: number;
  queryKey: readonly unknown[];
}): Promise<ProductsResponse> => {
  const [, , params] = queryKey as [string, string, ProductsQueryParams];
  const sortBy = params.sortBy ?? DEFAULT_PRODUCTS_QUERY_PARAMS.sortBy;
  const order = params.order ?? DEFAULT_PRODUCTS_QUERY_PARAMS.order;
  const res = await fetchProducts({
    query: params.query || undefined,
    limit: 20,
    skip: pageParam,
    sortBy,
    order,
  });
  if (!isOk(res)) throwApiError(res.error);

  return (res as { ok: true; data: ProductsResponse }).data;
};

export const useProductsInfiniteQuery = (params: ProductsQueryParams) => {
  const queryKey = queryKeys.products.list(params);

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam, queryKey }) => fetchProductsPage({ pageParam, queryKey }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: ProductsResponse, allPages: ProductsResponse[]) => {
      const loaded = allPages.reduce((acc, page) => acc + page.products.length, 0);

      return loaded < lastPage.total ? loaded : undefined;
    },
  });
};