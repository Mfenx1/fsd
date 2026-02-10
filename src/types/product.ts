export interface Product {
  id: number;
  _clientKey?: string;
  title: string;
  price: number;
  brand: string;
  sku?: string;
  rating: number;
  category: string;
  description?: string;
  thumbnail?: string;
  minimumOrderQuantity?: number;
  stock?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductAddPayload {
  title: string;
  price: number;
  brand: string;
  sku: string;
}

export interface FetchProductsParams {
  query?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: SortOrder;
}

export interface ProductsQueryParams {
  query?: string;
  sortBy?: string;
  order?: SortOrder;
}

export const DEFAULT_PRODUCTS_QUERY_PARAMS = {
  sortBy: 'title',
  order: 'asc' as SortOrder,
} as const;

export interface UpdateProductPayload {
  id: number;
  patch: Partial<Pick<Product, 'title' | 'price' | 'brand' | 'sku'>>;
}

export type SortOrder = 'asc' | 'desc';
