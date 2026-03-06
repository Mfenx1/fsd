import { getApiBaseUrl } from '../config/api';

const withBase = (baseUrl: string, path: string) => `${baseUrl}${path}`;

export const createApiEndpoints = (baseUrl: string) => ({
  base: baseUrl,
  products: () => withBase(baseUrl, '/products'),
  productsSearch: () => withBase(baseUrl, '/products/search'),
  productAdd: () => withBase(baseUrl, '/products/add'),
  product: (id: number) => withBase(baseUrl, `/products/${id}`),
} as const);

export const getApiEndpoints = () => createApiEndpoints(getApiBaseUrl());