export const RATING_THRESHOLD = 3;
export const SEARCH_DEBOUNCE_MS = 1000;

export const ROW_HEIGHT = 48;
export const VIRTUAL_OVERSCAN = 5;
export const ACTIONS_COL_WIDTH = 80;
export const FALLBACK_COL_WIDTH = 120;

export const DEFAULT_WIDTHS: Record<string, number> = {
  title: 220,
  brand: 120,
  sku: 120,
  rating: 90,
  price: 120,
  stock: 100,
};

export const SORTABLE_PRODUCT_KEYS = [
  'title',
  'brand',
  'sku',
  'rating',
  'price',
  'stock',
] as const;

export type SortableProductKey = (typeof SORTABLE_PRODUCT_KEYS)[number];

export const COLUMNS = [
  { key: 'title', label: 'Наименование', editable: true, sortable: true },
  { key: 'brand', label: 'Вендор', editable: true, sortable: false },
  { key: 'sku', label: 'Артикул', editable: true, sortable: false },
  { key: 'rating', label: 'Оценка', editable: false, sortable: true },
  { key: 'price', label: 'Цена, ₽', editable: true, sortable: true },
  { key: 'stock', label: 'Количество', editable: false, sortable: false },
] as const;

export type ProductTableColumn = (typeof COLUMNS)[number];
