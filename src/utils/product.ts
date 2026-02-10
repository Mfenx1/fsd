import { api } from '$api';
import { SORTABLE_PRODUCT_KEYS } from '$constants';
import type { FetchProductsParams, Product, SortOrder } from '$types';

const PRODUCT_COL_KEYS = ['title', 'brand', 'sku', 'rating', 'price', 'stock'] as const;
type ProductColKey = (typeof PRODUCT_COL_KEYS)[number];

const isProductColKey = (key: string): key is ProductColKey =>
  PRODUCT_COL_KEYS.includes(key as ProductColKey);

export const getProductValue = (
  product: Product,
  key: string
): string | number | null | undefined => {
  if (!isProductColKey(key)) return null;

  return product[key] ?? null;
};

const REQUIRED_FIELD_ERROR = 'Обязательное поле';
const PRICE_REQUIRED_ERROR = 'Обязательное поле';
const PRICE_POSITIVE_ERROR = 'Цена должна быть > 0';

export type ProductFormValues = {
  title: string;
  brand: string;
  sku: string;
  price: string;
};

export const validateProductForm = (
  values: ProductFormValues
): Record<string, string> => {
  const err: Record<string, string> = {};
  (['title', 'brand', 'sku'] as const).forEach((f) => {
    if (!values[f].trim()) err[f] = REQUIRED_FIELD_ERROR;
  });
  const price = parseFloat(values.price);
  if (values.price === '' || isNaN(price)) err.price = PRICE_REQUIRED_ERROR;
  else if (price <= 0) err.price = PRICE_POSITIVE_ERROR;

  return err;
};

export const isSortableProductKey = (
  key: string
): key is (typeof SORTABLE_PRODUCT_KEYS)[number] =>
  SORTABLE_PRODUCT_KEYS.includes(key as (typeof SORTABLE_PRODUCT_KEYS)[number]);

export const sortProducts = (
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

export const buildProductsUrl = (params: FetchProductsParams): URL => {
  const { query, limit = 100, skip = 0, sortBy, order } = params;
  const useSearch = Boolean(query?.trim());
  const url = useSearch ? new URL(api.productsSearch()) : new URL(api.products());
  if (useSearch) url.searchParams.set('q', query!.trim());
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('skip', String(skip));
  if (!useSearch && sortBy) url.searchParams.set('sortBy', sortBy);
  if (!useSearch && order) url.searchParams.set('order', order);

  return url;
};
