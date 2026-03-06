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
      className="flex items-center justify-center p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
      aria-label="Сохранить"
    >
      <Check size={16} strokeWidth={2.5} />
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="flex items-center justify-center p-2 rounded-lg bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-500 transition-colors"
      aria-label="Отмена"
    >
      <X size={16} strokeWidth={2.5} />
    </button>
  </div>
);

export const ProductRowActions = memo(ProductRowActionsComponent);