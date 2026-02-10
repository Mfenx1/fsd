export const ROUTES = {
  LOGIN: '/login',
  PRODUCTS: '/',
} as const;

export const ROUTE_SEGMENTS = {
  LOGIN: 'login',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
