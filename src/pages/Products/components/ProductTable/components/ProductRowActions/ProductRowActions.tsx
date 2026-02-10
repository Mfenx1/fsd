import { memo } from 'react';
import { Check, X } from 'lucide-react';

interface ProductRowActionsProps {
  onSave: () => void;
  onCancel: () => void;
}

const ProductRowActionsComponent = ({ onSave, onCancel }: ProductRowActionsProps) => (
  <div className="flex gap-2">
    <button
      type="button"
      onClick={onSave}
      className="
        flex items-center justify-center p-1 border-0 cursor-pointer
        bg-green-500 text-white
        hover:bg-green-600
      "
      aria-label="Сохранить"
    >
      <Check size={16} />
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="
        flex items-center justify-center p-1 border-0 cursor-pointer bg-gray-500
        text-white
        hover:bg-gray-700
      "
      aria-label="Отмена"
    >
      <X size={16} />
    </button>
  </div>
);

export const ProductRowActions = memo(ProductRowActionsComponent);
