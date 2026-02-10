import { useCallback } from 'react';
import { Toast } from '$components';
import { useProductsUIStore } from '$store';

export const ProductsToast = () => {
  const toast = useProductsUIStore((s) => s.toast);
  const setToast = useProductsUIStore((s) => s.setToast);

  const onToastClose = useCallback(() => setToast(null), [setToast]);

  if (!toast) return null;
  
  return (
    <Toast
      message={toast.message}
      variant={toast.variant}
      position={toast.position}
      onClose={onToastClose}
    />
  );
};
