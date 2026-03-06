export interface ProductsUrlParams {
  q?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  skip?: number;
}

export const buildProductsUrl = (params: ProductsUrlParams, overrides?: Partial<ProductsUrlParams>): string => {
  const p = { ...params, ...overrides };
  const search = new URLSearchParams();
  if (p.q) search.set('q', p.q);
  if (p.sortBy && p.sortBy !== 'title') search.set('sort', p.sortBy);
  if (p.order && p.order !== 'asc') search.set('order', p.order);
  if (p.skip && p.skip > 0) search.set('skip', String(p.skip));
  const qs = search.toString();
  return `/products${qs ? `?${qs}` : ''}`;
};