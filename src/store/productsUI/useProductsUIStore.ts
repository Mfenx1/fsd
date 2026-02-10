import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { withDevtools } from '../utils';
import type { SliceSetState } from '../utils';
import { createProductsUISlice } from './productsUISlice';
import type { ProductsUISlice } from './productsUISlice';

export const useProductsUIStore = create<ProductsUISlice>()(
  withDevtools<ProductsUISlice>('ProductsUI')((set) => ({
    ...createProductsUISlice(set as unknown as SliceSetState<ProductsUISlice>),
  }))
);

export const useProductsUISearch = () =>
  useProductsUIStore(useShallow((s) => ({ search: s.search, setSearch: s.setSearch })));

export const useProductsUIToast = () =>
  useProductsUIStore(useShallow((s) => ({ toast: s.toast, setToast: s.setToast })));

export const useProductsUIEditing = () =>
  useProductsUIStore(useShallow((s) => ({ editing: s.editing, setEditing: s.setEditing })));

export const useProductsUIAddingNew = () =>
  useProductsUIStore(useShallow((s) => ({ addingNew: s.addingNew, setAddingNew: s.setAddingNew })));
