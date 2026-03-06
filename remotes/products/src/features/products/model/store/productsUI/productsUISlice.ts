import type { ToastVariant, ToastPosition } from '$shared';

export interface EditingState {
  id: number;
  clientKey?: string;
}

export interface ToastState {
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
}

export interface ProductsUISlice {
  search: string;
  toast: ToastState | null;
  editing: EditingState | null;
  addingNew: boolean;
  setSearch: (search: string) => void;
  setToast: (toast: ToastState | string | null) => void;
  setEditing: (editing: EditingState | null) => void;
  setAddingNew: (addingNew: boolean) => void;
}

type SetState = (partial: unknown, ...args: unknown[]) => void;

export const createProductsUISlice = (set: SetState): ProductsUISlice => ({
  search: '',
  toast: null,
  editing: null,
  addingNew: false,
  setSearch: (search) => set({ search }, false, 'setSearch'),
  setToast: (toast) =>
    set(
      {
        toast:
          toast == null ? null : typeof toast === 'string' ? { message: toast } : toast,
      },
      false,
      'setToast'
    ),
  setEditing: (editing) => set({ editing }, false, 'setEditing'),
  setAddingNew: (addingNew) => set({ addingNew }, false, 'setAddingNew'),
});