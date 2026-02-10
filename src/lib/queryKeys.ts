import type { SortOrder } from '$types';

export const queryKeys = {
  auth: {
    me: (token: string | null) => ['auth', 'me', token] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params: { query?: string; sortBy?: string; order?: SortOrder }) =>
      ['products', 'list', params] as const,
  },
} as const;
