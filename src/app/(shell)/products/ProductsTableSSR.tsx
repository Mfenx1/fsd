import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ProductSSR } from './fetchProducts';
import { buildProductsUrl } from './productsUrl';

const COLUMNS = [
  { key: 'title', label: 'Наименование', sortable: true, width: 220 },
  { key: 'brand', label: 'Вендор', sortable: false, width: 120 },
  { key: 'sku', label: 'Артикул', sortable: false, width: 120 },
  { key: 'rating', label: 'Оценка', sortable: true, width: 90 },
  { key: 'price', label: 'Цена, ₽', sortable: true, width: 120 },
  { key: 'stock', label: 'Количество', sortable: false, width: 100 },
] as const;

const TABLE_MIN_WIDTH =
  COLUMNS.reduce((s, c) => s + c.width, 0) + 80; 
interface SearchParams {
  q?: string;
  sortBy: string;
  order: 'asc' | 'desc';
  skip: number;
  limit: number;
}

const formatCell = (value: unknown, key: string): string => {
  if (value == null || value === '') return '—';
  if (key === 'rating' && typeof value === 'number') return `${value.toFixed(1)}/5`;
  if (key === 'price' && typeof value === 'number') return value.toLocaleString('ru-RU');
  return String(value);
};

interface ProductsTableSSRProps {
  products: ProductSSR[];
  searchParams: SearchParams;
}

export const ProductsTableSSR = ({ products, searchParams }: ProductsTableSSRProps) => {
  const { sortBy, order } = searchParams;
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyScrollRef.current;
    const header = headerScrollRef.current;
    if (!body || !header) return;
    const sync = () => {
      header.scrollLeft = body.scrollLeft;
    };
    body.addEventListener('scroll', sync);
    return () => body.removeEventListener('scroll', sync);
  }, []);

  if (products.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 text-zinc-500 dark:text-zinc-400">
        Нет товаров
      </div>
    );
  }

  const table = (
        <table
          className="border-separate border-spacing-0 table-fixed [--row-height:48px]"
          style={{ width: '100%', minWidth: TABLE_MIN_WIDTH }}
        >
          <colgroup>
            {COLUMNS.map(({ key, width }) => (
              <col
                key={key}
                className="col-resizable"
                style={{ '--col-width': `${width}px`, '--col-min-width': '60px' } as React.CSSProperties}
              />
            ))}
            <col className="w-20 min-w-[80px]" />
          </colgroup>
          <thead>
            <tr className="sticky top-0 z-10 bg-white dark:bg-zinc-800 shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
              {COLUMNS.map(({ key, label, sortable }) => {
                const nextOrder = sortable && sortBy === key ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
                const sortUrl = sortable
                  ? buildProductsUrl(searchParams, { sortBy: key, order: nextOrder, skip: 0 })
                  : null;
                const labelContent = sortUrl ? (
                  <Link
                    href={sortUrl}
                    className="sort-btn inline-flex items-center gap-1 align-middle hover:text-zinc-900 dark:hover:text-zinc-100 no-underline"
                  >
                    {label}
                    {sortBy === key && (
                      <span className="inline-flex items-center text-indigo-500">
                        {order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </Link>
                ) : (
                  <span className="th-label text-inherit font-inherit">{label}</span>
                );
                return (
                  <th
                    key={key}
                    className="col-resizable py-3 px-4 text-left align-middle font-semibold text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 relative [&:not(:first-child)]:text-center [&:not(:first-child)_.sort-btn]:inline-flex [&:not(:first-child)_.sort-btn]:justify-center [&:not(:first-child)_.th-label]:inline-flex [&:not(:first-child)_.th-label]:justify-center"
                    style={{ '--col-width': `${COLUMNS.find((c) => c.key === key)!.width}px`, '--col-min-width': '60px' } as React.CSSProperties}
                    scope="col"
                  >
                    {labelContent}
                  </th>
                );
              })}
              <th
                className="w-20 min-w-[80px] py-3 px-4 text-left align-middle font-semibold text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 relative"
                scope="col"
              />
            </tr>
          </thead>
        </table>
  );

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-800 h-full min-h-[300px] max-h-[calc(100vh-180px)] rounded-xl overflow-hidden">
      <div
        ref={headerScrollRef}
        className="shrink-0 overflow-x-auto overflow-y-hidden table-scroll table-scroll-header border-b border-zinc-200/80 dark:border-zinc-700"
      >
        {table}
      </div>
      <div
        ref={bodyScrollRef}
        className="flex-1 min-h-0 overflow-auto table-scroll"
      >
        <table
          className="border-separate border-spacing-0 table-fixed [--row-height:48px]"
          style={{ width: '100%', minWidth: TABLE_MIN_WIDTH }}
        >
          <colgroup>
            {COLUMNS.map(({ key, width }) => (
              <col
                key={key}
                className="col-resizable"
                style={{ '--col-width': `${width}px`, '--col-min-width': '60px' } as React.CSSProperties}
              />
            ))}
            <col className="w-20 min-w-[80px]" />
          </colgroup>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={`${product.id}-${index}`}
                className="bg-white dark:bg-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-700/50 transition-colors"
                style={{ height: 48, minHeight: 48, maxHeight: 48 }}
              >
                {COLUMNS.map(({ key }) => {
                  const isTitle = key === 'title';
                  const value = product[key as keyof ProductSSR];
                  const ratingNum =
                    key === 'rating' && typeof value === 'number'
                      ? `${value.toFixed(1)}/5`
                      : formatCell(value, key);

                  return (
                    <td
                      key={key}
                      className="py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b border-zinc-200/80 dark:border-zinc-700 first:text-left [&:not(:first-child)]:text-center"
                    >
                      {isTitle && product.thumbnail ? (
                        <span className="flex items-center gap-2 min-w-0">
                          <Image
                            src={product.thumbnail}
                            alt=""
                            width={32}
                            height={32}
                            sizes="32px"
                            priority={index === 0}
                            className="rounded object-cover shrink-0"
                          />
                          <span className="truncate">{formatCell(value, key)}</span>
                        </span>
                      ) : (
                        ratingNum
                      )}
                    </td>
                  );
                })}
                <td className="py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b border-zinc-200/80 dark:border-zinc-700 [&:not(:first-child)]:text-center" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};