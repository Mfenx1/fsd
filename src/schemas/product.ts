import { z } from 'zod';
import { EMPTY_CELL, FALLBACK_PRODUCT } from '$constants';
import type { Product } from '$types';
import { toNumber, toOptionalNumber, toOptionalString, toRequiredString } from '$utils';

const requiredString = (value: unknown) => toRequiredString(value, EMPTY_CELL);
const optionalNum = z.unknown().transform(toOptionalNumber).optional();
const optionalStr = z.unknown().transform(toOptionalString).optional();

export const ProductSchema = z.object({
  id: z.unknown().transform((value) => Number(value) || 0),
  title: z.unknown().transform(requiredString),
  brand: z.unknown().transform(requiredString),
  sku: z.unknown().transform((value) => {
    const str = value != null ? String(value).trim() : '';

    return str || undefined;
  }),
  price: z.unknown().transform(toNumber),
  rating: z.unknown().transform(toNumber),
  category: z.unknown().transform(requiredString),
  description: optionalStr,
  thumbnail: optionalStr,
  minimumOrderQuantity: optionalNum,
  stock: optionalNum,
});

export const parseProduct = (raw: unknown): Product => {
  const result = ProductSchema.safeParse(raw);

  return result.success ? (result.data as Product) : FALLBACK_PRODUCT;
};
