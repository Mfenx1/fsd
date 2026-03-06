import { z } from 'zod';
import { FALLBACK_PRODUCT, type Product } from './model';
import { EMPTY_CELL } from '$shared';

const toNumber = (value: unknown): number => {
  const num = Number(value);

  return Number.isFinite(num) ? num : NaN;
};

const toOptionalNumber = (value: unknown): number | undefined => {
  const num = Number(value);

  return Number.isFinite(num) ? num : undefined;
};

const toOptionalString = (value: unknown): string | undefined =>
  value != null ? String(value) : undefined;

const requiredString = (value: unknown): string =>
  (value != null ? String(value).trim() : '') || EMPTY_CELL;

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
  description: z.unknown().transform(toOptionalString).optional(),
  thumbnail: z.unknown().transform(toOptionalString).optional(),
  minimumOrderQuantity: z.unknown().transform(toOptionalNumber).optional(),
  stock: z.unknown().transform(toOptionalNumber).optional(),
});

export const parseProduct = (raw: unknown): Product => {
  const result = ProductSchema.safeParse(raw);

  return result.success ? (result.data as Product) : FALLBACK_PRODUCT;
};