import { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ToastPosition, ToastVariant } from '../../types/toast';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  onClose: () => void;
  duration?: number;
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  attention: 'bg-amber-500',
};

const positionStyles: Record<ToastPosition, string> = {
  'top-center': 'top-6 left-1/2 -translate-x-1/2',
  'top-right': 'top-6 right-6',
};

const ToastComponent = ({
  message,
  variant = 'success',
  position = 'top-right',
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    const timeoutId = setTimeout(onClose, duration);

    return () => clearTimeout(timeoutId);
  }, [onClose, duration]);

  return createPortal(
    <div
      className={`
        fixed py-3 px-5 text-white rounded-lg text-sm font-medium shadow-lg
        z-[9999]
        ${variantStyles[variant]}
        ${positionStyles[position]}
      `}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>,
    document.body
  );
};

export const Toast = memo(ToastComponent);