import { Filter, Plus, RotateCw } from 'lucide-react';
import { ICON_COLOR_LIGHT } from '$constants';

interface ProductsSectionBarProps {
  onAddClick: () => void;
}

export const ProductsSectionBar = ({ onAddClick }: ProductsSectionBarProps) => (
  <div className="flex items-center justify-between shrink-0 pb-4">
    <h2 className="text-base font-semibold text-gray-900">Все позиции</h2>
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="
          w-9 h-9 flex items-center justify-center bg-transparent border
          border-gray-200 rounded-lg text-gray-500 cursor-pointer
          hover:bg-gray-100 hover:text-gray-900
        "
        aria-label="Обновить"
      >
        <RotateCw size={20} color={ICON_COLOR_LIGHT} />
      </button>
      <button
        type="button"
        className="
          w-9 h-9 flex items-center justify-center bg-transparent border
          border-gray-200 rounded-lg text-gray-500 cursor-pointer
          hover:bg-gray-100 hover:text-gray-900
        "
        aria-label="Фильтр"
      >
        <Filter size={20} color={ICON_COLOR_LIGHT} />
      </button>
      <button
        type="button"
        onClick={onAddClick}
        className="
          flex items-center gap-2 py-2 px-4 text-sm font-semibold bg-blue-600
          text-white border-0 rounded-lg cursor-pointer
          hover:bg-blue-700
        "
      >
        <Plus size={18} />
        Добавить
      </button>
    </div>
  </div>
);
