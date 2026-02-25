'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '$shared';

type ModalSize = NonNullable<ModalProps['size']>;
const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export interface ModalProps {
    open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    position?: 'center' | 'bottom-right';
    className?: string;
    contentClassName?: string;
}

const POSITION_CLASS = {
  center: 'items-center justify-center p-4',
  'bottom-right': 'items-end justify-end p-4 pb-[5.5rem] pr-[5.5rem]',
} as const;

export const Modal = ({ open, onClose, title, children, size = 'md', position = 'center', className, contentClassName }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const isBottomRight = position === 'bottom-right';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn('fixed inset-0 z-[100] flex bg-black/40 backdrop-blur-sm', POSITION_CLASS[position])}
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: isBottomRight ? 0.96 : 0.95,
              y: isBottomRight ? 8 : 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: isBottomRight ? 0.96 : 0.95,
              y: isBottomRight ? 8 : 0,
            }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              'bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/30 border border-slate-200/80 dark:border-zinc-600/80 flex flex-col w-full max-h-[90vh] overflow-hidden',
              SIZE_CLASS[size ?? 'md'],
              className
            )}
            onClick={handleContentClick}
          >
            <div className="flex items-center justify-between shrink-0 px-5 py-4 border-b border-slate-200/80 dark:border-zinc-600/80 bg-slate-50/50 dark:bg-zinc-800/80">
              <h2 id="modal-title" className="text-lg font-medium text-slate-900 dark:text-zinc-100 tracking-tight">
                {title}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-slate-500 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-zinc-600/60 hover:text-slate-700 dark:hover:text-zinc-100 transition-colors duration-150"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            </div>
            <div className={cn('p-4 overflow-auto min-h-0 bg-white dark:bg-zinc-800', contentClassName)}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};