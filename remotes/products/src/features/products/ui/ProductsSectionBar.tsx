import { Filter, Plus, RotateCw } from 'lucide-react';

interface ProductsSectionBarProps {
  onAddClick: () => void;
}

export const ProductsSectionBar = ({ onAddClick }: ProductsSectionBarProps) => (
  <div className="flex items-center justify-between shrink-0 pb-4">
    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Все позиции</h2>
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="
          w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500
          hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200 transition-colors
        "
        aria-label="Обновить"
      >
        <RotateCw size={18} />
      </button>
      <button
        type="button"
        className="
          w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500
          hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200 transition-colors
        "
        aria-label="Фильтр"
      >
        <Filter size={18} />
      </button>
      <button
        type="button"
        onClick={onAddClick}
        className="
          flex items-center gap-2 py-2 px-4 text-sm font-medium bg-indigo-500 dark:bg-indigo-400
          text-white rounded-xl cursor-pointer transition-colors
          hover:bg-indigo-600 dark:hover:bg-indigo-300
        "
      >
        <Plus size={18} strokeWidth={2.5} />
        Добавить
      </button>
    </div>
  </div>
);