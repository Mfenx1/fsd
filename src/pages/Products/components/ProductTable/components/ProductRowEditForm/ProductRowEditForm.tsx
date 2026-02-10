import { memo, useCallback, useMemo, useState } from 'react';
import type { Product } from '$types';
import { RATING_THRESHOLD, type ProductTableColumn } from '$constants';
import { useProductsTable, useProductsUIStore } from '$store';
import { cn, formatCellValue, getProductValue, parsePriceInput, validateProductForm } from '$utils';
import { ProductRowActions } from '../ProductRowActions';

export interface ProductRowEditFormProps {
  product: Product;
  columns: readonly ProductTableColumn[];
}

const ProductRowEditFormComponent = ({ product, columns }: ProductRowEditFormProps) => {
  const isLowRating =
    typeof product.rating === 'number' && product.rating < RATING_THRESHOLD;
  const { onEdit } = useProductsTable();
  const setEditing = useProductsUIStore((s) => s.setEditing);
  const onEditingChange = useCallback(
    (id: number | null) => setEditing(id != null ? { id } : null),
    [setEditing]
  );
  const [editValues, setEditValues] = useState({
    title: product.title ?? '',
    brand: product.brand ?? '',
    sku: product.sku ?? '',
    price: product.price != null ? String(product.price) : '',
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const handleSave = useCallback(() => {
    const err = validateProductForm(editValues);
    setEditErrors(err);
    if (Object.keys(err).length > 0) return;
    onEdit(product.id, {
      title: editValues.title,
      brand: editValues.brand,
      sku: editValues.sku,
      price: parseFloat(editValues.price),
    });
    onEditingChange(null);
  }, [product.id, editValues, onEdit, onEditingChange]);

  const handleCancel = useCallback(() => {
    setEditErrors({});
    onEditingChange(null);
  }, [onEditingChange]);

  const handleEditKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') handleSave();
      if (event.key === 'Escape') handleCancel();
    },
    [handleSave, handleCancel]
  );

  const handleFieldChange = useCallback((fieldKey: keyof typeof editValues, rawValue: string) => {
    const value = fieldKey === 'price' ? parsePriceInput(rawValue) : rawValue;
    setEditValues((prev) => ({ ...prev, [fieldKey]: value }));
    setEditErrors((prev) => (prev[fieldKey] ? { ...prev, [fieldKey]: '' } : prev));
  }, []);

  const fieldHandlers = useMemo(
    () =>
      (['title', 'brand', 'sku', 'price'] as const).reduce(
        (acc, fieldKey) => ({
          ...acc,
          [fieldKey]: (event: React.ChangeEvent<HTMLInputElement>) =>
            handleFieldChange(fieldKey, event.target.value),
        }),
        {} as Record<keyof typeof editValues, (e: React.ChangeEvent<HTMLInputElement>) => void>
      ),
    [handleFieldChange]
  );

  return (
    <>
      {columns.map(({ key, editable }) => {
        const value = getProductValue(product, key);
        const isRating = key === 'rating';
        const ratingNum =
          isRating && typeof value === 'number' && Number.isFinite(value)
            ? value.toFixed(1)
            : null;

        return (
          <td
            key={key}
            className="
              py-1.5 px-4 text-sm text-gray-900 align-middle bg-white border-b
              border-gray-200
              [&:not(:first-child)]:text-center
            "
          >
            {editable ? (
              <div className="relative flex flex-col gap-1">
                <input
                  value={editValues[key as keyof typeof editValues] ?? ''}
                  onChange={fieldHandlers[key as keyof typeof editValues]}
                  type="text"
                  inputMode={key === 'price' ? 'decimal' : 'text'}
                  className={cn(
                    `
                      w-full min-h-6 py-1 px-2 text-sm bg-white border
                      text-gray-900 outline-none [box-sizing:border-box]
                    `,
                    editErrors[key] ? 'border-red-500' : 'border-blue-600'
                  )}
                  onKeyDown={handleEditKeyDown}
                  aria-invalid={editErrors[key] ? 'true' : 'false'}
                  aria-describedby={editErrors[key] ? `edit-${product.id}-${key}-error` : undefined}
                />
                {editErrors[key] && (
                  <span
                    id={`edit-${product.id}-${key}-error`}
                    className="
                      tooltip-error absolute top-[calc(100%+0.375rem)] left-0
                      z-[9999] py-1.5 px-2 text-xs text-white bg-red-500 rounded
                      shadow-md whitespace-nowrap max-w-full overflow-hidden
                      text-ellipsis
                    "
                    role="alert"
                  >
                    {editErrors[key]}
                  </span>
                )}
              </div>
            ) : isRating && ratingNum != null ? (
              <>
                <span className={cn(isLowRating && 'text-red-500 font-medium')}>
                  {ratingNum}
                </span>
                /5
              </>
            ) : (
              <span>{formatCellValue(value, key)}</span>
            )}
          </td>
        );
      })}
      <td className="
        py-1.5 px-4 text-sm text-gray-900 align-middle bg-white border-b
        border-gray-200
        [&:not(:first-child)]:text-center
      ">
        <ProductRowActions onSave={handleSave} onCancel={handleCancel} />
      </td>
    </>
  );
};

export const ProductRowEditForm = memo(ProductRowEditFormComponent);
