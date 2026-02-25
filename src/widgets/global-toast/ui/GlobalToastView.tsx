'use client';

import { useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toast } from '$shared';
import { useGlobalToastStore } from '../model';

export const GlobalToastView = () => {
  const toast = useGlobalToastStore((s) => s.toast);
  const setToast = useGlobalToastStore((s) => s.setToast);

  const onClose = useCallback(() => setToast(null), [setToast]);

  return (
    <AnimatePresence>
      {toast && (
        <Toast
          key="global-toast"
          message={toast.message}
          variant={toast.variant}
          position={toast.position}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
};