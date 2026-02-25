import { useCallback, useMemo } from 'react';
import { useAddProductMutation, useUpdateProductMutation, useProductsUIStore } from '../..';
import { useProductsTableState } from './useProductsTableStore';
import type { Product, SortOrder } from '$entities/product';

export interface UseProductsTableReturn {
  sortBy: string;
  order: SortOrder;
  addingNew: boolean;
  onColumnResize: (col: string, width: number) => void;
  onSort: (col: string) => void;
  onAddClick: () => void;
  onAddCancel: () => void;
  onAdd: (payload: {
    title: string;
    price: number;
    brand: string;
    sku: string;
  }) => void;
  onEdit: (
    productId: number,
    patch: Partial<Pick<Product, 'title' | 'price' | 'brand' | 'sku'>>
  ) => void;
}

export const useProductsTable = (): UseProductsTableReturn => {
  const { sortBy, order, setColumnWidth, setSort } = useProductsTableState();
  const addingNew = useProductsUIStore((s) => s.addingNew);

  const addMutation = useAddProductMutation();
  const updateMutation = useUpdateProductMutation();

  const onSort = useCallback(
    (col: string) => {
      const nextOrder: SortOrder =
        sortBy === col ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
      setSort(col, nextOrder);
    },
    [sortBy, order, setSort]
  );

  const onColumnResize = useCallback((col: string, width: number) => {
    setColumnWidth(col, width);
  }, [setColumnWidth]);

  const onAddClick = useCallback(() => {
    useProductsUIStore.getState().setAddingNew(true);
  }, []);

  const onAddCancel = useCallback(() => {
    useProductsUIStore.getState().setAddingNew(false);
  }, []);

  const onEdit = useCallback(
    async (
      productId: number,
      patch: Partial<Pick<Product, 'title' | 'price' | 'brand' | 'sku'>>
    ) => {
      try {
        await updateMutation.mutateAsync({ id: productId, patch });
        useProductsUIStore.getState().setEditing(null);
      } catch {
        void 0;
      }
    },
    [updateMutation]
  );

  const onAdd = useCallback(
    async (payload: {
      title: string;
      price: number;
      brand: string;
      sku: string;
    }) => {
      if (!payload.title.trim()) return;
      if (payload.price <= 0) return;
      if (!payload.brand.trim()) return;
      if (!payload.sku.trim()) return;
      try {
        await addMutation.mutateAsync(payload);
        useProductsUIStore.getState().setAddingNew(false);
        useProductsUIStore.getState().setToast({
          message: 'Товар успешно добавлен',
          variant: 'success',
        });
      } catch {
        useProductsUIStore.getState().setAddingNew(false);
      }
    },
    [addMutation]
  );

  return useMemo(
    () => ({
      sortBy,
      order,
      addingNew,
      onColumnResize,
      onSort,
      onAddClick,
      onAddCancel,
      onAdd,
      onEdit,
    }),
    [
      sortBy,
      order,
      addingNew,
      onColumnResize,
      onSort,
      onAddClick,
      onAddCancel,
      onAdd,
      onEdit,
    ]
  );
};