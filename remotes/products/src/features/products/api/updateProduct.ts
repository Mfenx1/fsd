import { patch } from '$shared';
import { getApiEndpoints } from '$shared/api';
import { parseProduct } from '$entities/product';
import type { Product, UpdateProductPayload } from '$entities/product';

export const updateProduct = async ({
  id,
  patch: patchData,
}: UpdateProductPayload): Promise<Product> => {
  const ep = getApiEndpoints();
  const raw = await patch<Record<string, unknown>>(ep.product(id), patchData);

  return parseProduct(raw);
};