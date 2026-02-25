import { SORTABLE_PRODUCT_KEYS } from '$shared';
import type { Product } from '$entities/product';

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