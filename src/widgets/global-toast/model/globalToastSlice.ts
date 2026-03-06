import type { ToastPosition, ToastVariant } from '$shared';

export type { ToastPosition, ToastVariant };

export interface ToastState {
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
}

export interface GlobalToastSlice {
  toast: ToastState | null;
  setToast: (toast: ToastState | string | null) => void;
}

export const createGlobalToastSlice = (set: (p: Partial<GlobalToastSlice>) => void): GlobalToastSlice => ({
  toast: null,
  setToast: (toast) =>
    set({
      toast: toast == null ? null : typeof toast === 'string' ? { message: toast } : toast,
    }),
});