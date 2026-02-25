import type { SortOrder } from '$entities/product';

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (params: { query?: string; sortBy?: string; order?: SortOrder }) =>
      ['products', 'list', params] as const,
  },
} as const;