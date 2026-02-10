import { useCallback, useEffect, useMemo, useState } from 'react';
import { parsePriceInput, validateProductForm } from '$utils';

const ADD_ROW_INITIAL = { title: '', price: '', brand: '', sku: '' };

export interface AddProductFormHandlers {
  title: (event: React.ChangeEvent<HTMLInputElement>) => void;
  brand: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sku: (event: React.ChangeEvent<HTMLInputElement>) => void;
  price: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useAddProductForm = (
  onAdd: (payload: {
    title: string;
    price: number;
    brand: string;
    sku: string;
  }) => void,
  addingNew: boolean
) => {
  const [newRow, setNewRow] = useState(ADD_ROW_INITIAL);
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  const handleFieldChange = useCallback(
    (field: keyof typeof ADD_ROW_INITIAL, rawValue: string) => {
      const value = field === 'price' ? parsePriceInput(rawValue) : rawValue;
      setNewRow((prev) => ({ ...prev, [field]: value }));
      setAddErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
    },
    []
  );

  const fieldHandlers = useMemo<AddProductFormHandlers>(
    () =>
      (['title', 'brand', 'sku', 'price'] as const).reduce(
        (acc, field) => ({
          ...acc,
          [field]: (event: React.ChangeEvent<HTMLInputElement>) =>
            handleFieldChange(field, event.target.value),
        }),
        {} as AddProductFormHandlers
      ),
    [handleFieldChange]
  );

  useEffect(() => {
    if (!addingNew) {
      queueMicrotask(() => {
        setNewRow(ADD_ROW_INITIAL);
        setAddErrors({});
      });
    }
  }, [addingNew]);

  const handleAddSubmit = useCallback(() => {
    const err = validateProductForm(newRow);
    setAddErrors(err);
    if (Object.keys(err).length > 0) return;
    onAdd({
      title: newRow.title.trim(),
      price: parseFloat(newRow.price),
      brand: newRow.brand.trim(),
      sku: newRow.sku.trim(),
    });
    setNewRow(ADD_ROW_INITIAL);
    setAddErrors({});
  }, [newRow, onAdd]);

  return { newRow, addErrors, fieldHandlers, handleAddSubmit };
};
