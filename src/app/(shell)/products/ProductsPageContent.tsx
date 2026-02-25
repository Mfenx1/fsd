'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useResolvedTheme } from '$widgets';
import { Bell, Filter, Globe, Mail, Plus, RotateCw, Search, SlidersVertical } from 'lucide-react';
import { RemoteFromRegistry } from '$widgets';
import { ProductsTableSSR } from './ProductsTableSSR';
import { buildProductsUrl } from './productsUrl';
import type { ProductsResponseSSR } from './fetchProducts';

const PRODUCTS_MOUNT_ID = 'products-ssr-mount';

interface ProductsSearchParams {
  q?: string;
  sortBy: string;
  order: 'asc' | 'desc';
  skip: number;
  limit: number;
}

interface ProductsPageContentProps {
  initialData: ProductsResponseSSR;
  searchParams: ProductsSearchParams;
}

export const ProductsPageContent = ({ initialData, searchParams }: ProductsPageContentProps) => {
  const queryClient = useQueryClient();
  const theme = useResolvedTheme();
  const baseUrl = buildProductsUrl(searchParams);

  return (
    <>
      <div
        id={PRODUCTS_MOUNT_ID}
        className="flex flex-col h-full min-h-0 py-6 px-6"
      >
        <div className="flex flex-col h-full min-h-0">
          <header className="shrink-0 flex flex-col gap-4">
            <div
              className="
                flex items-center gap-4 md:gap-6 p-4 md:px-5
                bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm
              "
            >
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight shrink-0">
                Товары
              </h1>
              <form action="/products" method="GET" className="relative flex-1 min-w-0 max-w-md">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 dark:text-zinc-300 pointer-events-none"
                  size={18}
                  aria-hidden
                />
                <input
                  type="search"
                  name="q"
                  placeholder="Поиск..."
                  defaultValue={searchParams.q}
                  aria-label="Поиск товаров"
                  className="
                    w-full h-10 pl-10 pr-4 text-sm
                    bg-zinc-100/80 dark:bg-zinc-700/50 border border-zinc-200/60 dark:border-zinc-600
                    rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
                    transition-colors
                  "
                />
              </form>
              <div className="flex items-center gap-1 shrink-0 ml-auto">
                <button type="button" className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-600 dark:hover:text-zinc-100 transition-colors" aria-label="Язык" tabIndex={-1}>
                  <Globe size={18} />
                </button>
                <button type="button" className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-600 dark:hover:text-zinc-100 transition-colors" aria-label="Уведомления" tabIndex={-1}>
                  <Bell size={18} />
                </button>
                <button type="button" className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-600 dark:hover:text-zinc-100 transition-colors" aria-label="Почта" tabIndex={-1}>
                  <Mail size={18} />
                </button>
                <button type="button" className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-600 dark:hover:text-zinc-100 transition-colors" aria-label="Настройки" tabIndex={-1}>
                  <SlidersVertical size={18} />
                </button>
              </div>
            </div>
          </header>
        <section aria-label="Все позиции" className="flex-1 min-h-0 mt-5 flex flex-col p-5 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between shrink-0 pb-4">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Все позиции
            </h2>
            <div className="flex items-center gap-2">
              <Link
                href={baseUrl}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-600 dark:hover:text-zinc-100 transition-colors"
                aria-label="Обновить"
              >
                <RotateCw size={18} />
              </Link>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-600 dark:hover:text-zinc-100 transition-colors" aria-label="Фильтр" tabIndex={-1}>
                <Filter size={18} />
              </button>
              <button type="button" className="flex items-center gap-2 py-2 px-4 text-sm font-medium bg-indigo-500 dark:bg-indigo-400 text-white rounded-xl cursor-default" aria-label="Добавить">
                <Plus size={18} strokeWidth={2.5} />
                Добавить
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            <ProductsTableSSR
              products={initialData.products}
              searchParams={searchParams}
            />
          </div>
        </section>
        </div>
      </div>
      <RemoteFromRegistry
        remoteName="products"
        mountTargetId={PRODUCTS_MOUNT_ID}
        mountProps={{
          queryClient,
          theme,
          initialData,
          searchParams: {
            q: searchParams.q,
            sortBy: searchParams.sortBy,
            order: searchParams.order,
          },
        }}
      />
    </>
  );
};