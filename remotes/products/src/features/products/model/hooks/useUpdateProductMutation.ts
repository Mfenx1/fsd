import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '..';
import type { ProductsResponse } from '$entities/product';
import { updateProduct } from '$features/products/api';

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
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
        context.previousData.forEach(([qk, data]) => {
          queryClient.setQueryData(qk, data);
        });
      }
    },
  });
};