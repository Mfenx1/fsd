import {
  err,
  get,
  ok,
  toApiError,
  getApiEndpoints,
  SORTABLE_PRODUCT_KEYS,
  type ApiError,
  type ApiResult,
} from '$shared';
import {
  parseProduct,
  type FetchProductsParams,
  type ProductsResponse,
  type Product,
  type SortOrder,
} from '$entities/product';

const isSortableProductKey = (
  key: string
): key is (typeof SORTABLE_PRODUCT_KEYS)[number] =>
  SORTABLE_PRODUCT_KEYS.includes(key as (typeof SORTABLE_PRODUCT_KEYS)[number]);

const sortProducts = (
  products: Product[],
  sortBy: string,
  order: SortOrder
): Product[] => {
  if (!isSortableProductKey(sortBy)) return products;
  const mult = order === 'asc' ? 1 : -1;

  return [...products].sort((itemA, itemB) => {
    const valueA = itemA[sortBy];
    const valueB = itemB[sortBy];
    if (typeof valueA === 'number' && typeof valueB === 'number')
      return mult * (valueA - valueB);

    return mult * String(valueA ?? '').localeCompare(String(valueB ?? ''));
  });
};

const buildProductsUrl = (params: FetchProductsParams): URL => {
  const { query, limit = 100, skip = 0, sortBy, order } = params;
  const useSearch = Boolean(query?.trim());
  const ep = getApiEndpoints();
  const url = useSearch ? new URL(ep.productsSearch()) : new URL(ep.products());
  if (useSearch && query) url.searchParams.set('q', query.trim());
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('skip', String(skip));
  if (!useSearch && sortBy) url.searchParams.set('sortBy', sortBy);
  if (!useSearch && order) url.searchParams.set('order', order);

  return url;
};

export const fetchProducts = async (
  params: FetchProductsParams = {}
): Promise<ApiResult<ProductsResponse, ApiError>> => {
  try {
    const url = buildProductsUrl(params);
    const data = await get<{ products: unknown[]; total: number; skip: number; limit: number }>(url);
    let products = data.products.map((item) => parseProduct(item));
    const { query, sortBy, order } = params;
    if (query?.trim() && sortBy && order) {
      products = sortProducts(products, sortBy, order);
    }

    return ok({ ...data, products });
  } catch (error) {
    return err(toApiError(error));
  }
};