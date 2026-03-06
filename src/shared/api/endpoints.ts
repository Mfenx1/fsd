import { API_BASE } from '../config';

const withBase = (baseUrl: string, path: string) => `${baseUrl}${path}`;

export const createApiEndpoints = (baseUrl: string) => {
  return {
    base: baseUrl,
    login: () => withBase(baseUrl, '/auth/login'),
    me: () => withBase(baseUrl, '/auth/me'),
  } as const;
};

export const api = createApiEndpoints(API_BASE);