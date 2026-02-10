import { API_BASE } from '$constants';

const withBase = (baseUrl: string, path: string) => `${baseUrl}${path}`;

export const createApiEndpoints = (baseUrl: string) => {
  return {
    base: baseUrl,
    login: () => withBase(baseUrl, '/auth/login'),
    me: () => withBase(baseUrl, '/auth/me'),
    products: () => withBase(baseUrl, '/products'),
    productsSearch: () => withBase(baseUrl, '/products/search'),
    productAdd: () => withBase(baseUrl, '/products/add'),
  } as const;
};

export const api = createApiEndpoints(API_BASE);
