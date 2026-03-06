import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '..';
import type { Product, ProductsResponse } from '$entities/product';
import { generateClientKey, generateTempId } from '$shared';
import { addProduct } from '$features/products/api';

export const useAddProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });

      const previousData = queryClient.getQueriesData<InfiniteData<ProductsResponse>>({
        queryKey: ['products', 'list'],
      });

      const tempId = generateTempId();
      const clientKey = generateClientKey();
      const tempProduct: Product = {
        id: tempId,
        _clientKey: clientKey,
        title: payload.title,
        price: payload.price,
        brand: payload.brand,
        sku: payload.sku,
        rating: 0,
        category: 'uncategorized',
      };

      queryClient.setQueriesData<InfiniteData<ProductsResponse>>(
        { queryKey: ['products', 'list'] },
        (old) => {
          if (!old?.pages.length) return old;
          const first = old.pages[0];
          if (!first) return old;
          const rest = old.pages.slice(1);
          const updated: ProductsResponse = {
            ...first,
            products: [tempProduct, ...first.products],
            total: first.total + 1,
          };

          return { ...old, pages: [updated, ...rest] };
        }
      );

      return { previousData, tempId, clientKey };
    },
    onSuccess: (savedProduct, payload, context) => {
      const tempId = context?.tempId;
      const clientKey = context?.clientKey;
      if (tempId == null || savedProduct == null) return;
      const mergedProduct: Product = {
        ...savedProduct,
        id: savedProduct.id ?? tempId,
        rating: savedProduct.rating ?? 0,
        category: savedProduct.category ?? 'uncategorized',
        _clientKey: clientKey,
        title: payload.title,
        brand: payload.brand,
        sku: payload.sku,
        price: payload.price,
      };
      queryClient.setQueriesData<InfiniteData<ProductsResponse>>(
        { queryKey: ['products', 'list'] },
        (old) => {
          if (!old?.pages.length) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              products: page.products.map((product) =>
                product.id === tempId ? mergedProduct : product
              ),
            })),
          };
        }
      );
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