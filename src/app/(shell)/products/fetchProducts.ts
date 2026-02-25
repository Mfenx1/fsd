import { API_BASE } from '$shared';

export interface ProductSSR {
  id: number;
  title: string;
  brand: string;
  sku?: string;
  rating: number;
  price: number;
  stock?: number;
  thumbnail?: string;
}

export interface ProductsResponseSSR {
  products: ProductSSR[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsFetchParams {
  q?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
}

const PRODUCTS_SSR_LIMIT = 50;
const SORTABLE_KEYS = ['title', 'brand', 'sku', 'rating', 'price', 'stock'] as const;

const isSortableKey = (k: string): k is (typeof SORTABLE_KEYS)[number] =>
  SORTABLE_KEYS.includes(k as (typeof SORTABLE_KEYS)[number]);

const sortProducts = (
  items: ProductSSR[],
  sortBy: string,
  order: 'asc' | 'desc'
): ProductSSR[] => {
  if (!isSortableKey(sortBy)) return items;
  const mult = order === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const va = a[sortBy as keyof ProductSSR];
    const vb = b[sortBy as keyof ProductSSR];
    if (typeof va === 'number' && typeof vb === 'number') return mult * (va - vb);
    return mult * String(va ?? '').localeCompare(String(vb ?? ''));
  });
};

export const fetchProductsForSSR = async (
  params: ProductsFetchParams = {}
): Promise<ProductsResponseSSR | null> => {
  try {
    const { q, sortBy = 'title', order = 'asc', skip = 0, limit = PRODUCTS_SSR_LIMIT } = params;
    const hasSearch = Boolean(q?.trim());
    const baseUrl = hasSearch
      ? `${API_BASE}/products/search?q=${encodeURIComponent(q!.trim())}`
      : `${API_BASE}/products`;
    const url = new URL(baseUrl);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('skip', String(skip));

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      products: ProductSSR[];
      total: number;
      skip?: number;
      limit?: number;
    };

    let products = data.products ?? [];
    const total = data.total ?? products.length;
    if (hasSearch && sortBy && order) {
      products = sortProducts(products, sortBy, order);
    } else if (!hasSearch) {
      products = sortProducts(products, sortBy, order);
    }

    return {
      products,
      total,
      skip: data.skip ?? skip,
      limit: data.limit ?? limit,
    };
  } catch {
    return null;
  }
};