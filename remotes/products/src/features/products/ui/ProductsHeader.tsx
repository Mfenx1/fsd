import { useCallback } from 'react';
import { Bell, Globe, Mail, Search, SlidersVertical } from 'lucide-react';
import { useProductsUIStore } from '../model';

export const ProductsHeader = () => {
  const search = useProductsUIStore((s) => s.search);
  const setSearch = useProductsUIStore((s) => s.setSearch);

  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
    [setSearch]
  );

  return (
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
        <div className="relative flex-1 min-w-0 max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none"
            size={18}
            aria-hidden
          />
          <input
            type="search"
            placeholder="Поиск..."
            value={search}
            onChange={onSearchChange}
            className="
              w-full h-10 pl-10 pr-4 text-sm bg-zinc-100/80 dark:bg-zinc-700/50 border border-zinc-200/60 dark:border-zinc-600
              rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
              transition-colors
            "
          />
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <button
            type="button"
            className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="Язык"
          >
            <Globe size={18} />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="Уведомления"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="Почта"
          >
            <Mail size={18} />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label="Настройки"
          >
            <SlidersVertical size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};