import { api } from '$api';
import { err, get, ok, patch, post, toApiError, type ApiError, type ApiResult } from '$lib';
import { parseProduct } from '$schemas';
import type {
  FetchProductsParams,
  Product,
  ProductAddPayload,
  ProductsResponse,
} from '$types';
import { buildProductsUrl, sortProducts } from '$utils';
export type { FetchProductsParams } from '$types';

export const fetchProducts = async (
  params: FetchProductsParams = {}
): Promise<ApiResult<ProductsResponse, ApiError>> => {
  try {
    const { query, sortBy, order } = params;
    const useSearch = Boolean(query?.trim());
    const url = buildProductsUrl(params);

    const data = await get<{ products: unknown[]; total: number; skip: number; limit: number }>(
      url
    );
    let products = data.products.map((item) => parseProduct(item));

    if (useSearch && sortBy && order) {
      products = sortProducts(products, sortBy, order);
    }

    return ok({ ...data, products });
  } catch (error) {
    return err(toApiError(error));
  }
};

export const addProduct = async (
  payload: ProductAddPayload
): Promise<ApiResult<Product, ApiError>> => {
  try {
    const data = await post<Record<string, unknown>>(api.productAdd(), {
      ...payload,
      category: 'uncategorized',
      description: '',
    });

    return ok(parseProduct(data));
  } catch (error) {
    return err(toApiError(error));
  }
};

export const updateProduct = async (
  productId: number,
  patchPayload: Partial<Pick<Product, 'title' | 'price' | 'brand' | 'sku'>>
): Promise<ApiResult<Product, ApiError>> => {
  try {
    const data = await patch<Record<string, unknown>>(
      `${api.products()}/${productId}`,
      patchPayload
    );

    return ok(parseProduct(data));
  } catch (error) {
    return err(toApiError(error));
  }
};
