import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isOk, queryKeys, throwApiError } from '$lib';
import { updateProduct } from '$services';
import type { ProductsResponse, UpdateProductPayload } from '$types';

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id: productId, patch }: UpdateProductPayload) => {
      const res = await updateProduct(productId, patch);
      if (isOk(res)) return res.data;
      throwApiError(res.error);
    },
    onMutate: async ({ id: productId, patch }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });

      const previousData = queryClient.getQueriesData<InfiniteData<ProductsResponse>>({
        queryKey: ['products', 'list'],
      });

      queryClient.setQueriesData<InfiniteData<ProductsResponse>>(
        { queryKey: ['products', 'list'] },
        (old) => {
          if (!old?.pages.length) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              products: page.products.map((product) =>
                product.id === productId ? { ...product, ...patch } : product
              ),
            })),
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _payload, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
};
