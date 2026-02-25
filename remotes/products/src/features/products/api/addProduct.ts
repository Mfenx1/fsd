import { post } from '$shared';
import { getApiEndpoints } from '$shared/api';
import { parseProduct } from '$entities/product';
import type { Product, ProductAddPayload } from '$entities/product';

export const addProduct = async (payload: ProductAddPayload): Promise<Product> => {
  const ep = getApiEndpoints();
  const raw = await post<Record<string, unknown>>(ep.productAdd(), {
    ...payload,
    category: 'uncategorized',
    description: '',
  });

  return parseProduct(raw);
};