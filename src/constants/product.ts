import type { Product } from '$types';
import { EMPTY_CELL } from './display';

export const FALLBACK_PRODUCT: Product = {
  id: 0,
  title: EMPTY_CELL,
  brand: EMPTY_CELL,
  price: NaN,
  rating: NaN,
  category: EMPTY_CELL,
};
