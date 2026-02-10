import { useCallback } from 'react';
import { Bell, Globe, Mail, Search, SlidersVertical } from 'lucide-react';
import { ICON_COLOR_LIGHT } from '$constants';
import { useAuth, useProductsUIStore } from '$store';

export const ProductsHeader = () => {
  const { logout } = useAuth();
  const search = useProductsUIStore((s) => s.search);
  const setSearch = useProductsUIStore((s) => s.setSearch);
  
  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value),
    [setSearch]
  );

  return (
    <header className="shrink-0 flex flex-col gap-4">
      <div className="
        flex items-center justify-between p-4 px-5 bg-white rounded-xl
      ">
        <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative flex-1 min-w-0 ml-48 mr-16 flex items-center">
            <Search
              className="
                absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500
                pointer-events-none
              "
              size={20}
            />
            <input
              type="search"
              placeholder="Найти"
              value={search}
              onChange={onSearchChange}
              className="
                w-full h-9 pl-11 pr-4 text-sm bg-gray-100 border-0 rounded-lg
                text-gray-900
                placeholder:text-gray-500
                focus:outline-none
              "
            />
          </div>
          <div className="w-px shrink-0 self-stretch bg-gray-200" aria-hidden />
          <div className="flex items-center gap-4 ml-2">
            <Globe size={20} color={ICON_COLOR_LIGHT} />
            <Bell size={20} color={ICON_COLOR_LIGHT} />
            <Mail size={20} color={ICON_COLOR_LIGHT} />
            <SlidersVertical size={20} color={ICON_COLOR_LIGHT} />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={logout}
              className="
                py-1.5 px-3 text-sm bg-transparent text-gray-500 border
                border-gray-200 rounded-lg cursor-pointer
                hover:bg-gray-100 hover:text-gray-900
              "
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
