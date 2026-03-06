'use client';

import { memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { cn, SUPPORTED_LOCALES, type Locale } from '$shared';

interface LocaleDropdownPanelProps {
  open: boolean;
  locale: Locale;
  onSelect: (value: Locale) => void;
  triggerRect: DOMRect;
  panelRef: React.Ref<HTMLDivElement>;
  ariaLabel: string;
  t: (key: Locale) => string;
}

const LocaleDropdownPanelInner = ({
  open,
  locale,
  onSelect,
  triggerRect,
  panelRef,
  ariaLabel,
  t,
}: LocaleDropdownPanelProps) => {
  const handleOptionClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const value = e.currentTarget.dataset.locale as Locale | undefined;
      if (value && SUPPORTED_LOCALES.includes(value)) onSelect(value);
    },
    [onSelect]
  );

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
          className="fixed z-[200] rounded-xl border border-slate-200/80 dark:border-zinc-600/80 bg-white dark:bg-zinc-800 shadow-xl shadow-slate-900/10 dark:shadow-black/30 py-1"
          style={{
            top: triggerRect.bottom + 6,
            left: triggerRect.left,
            width: Math.max(triggerRect.width, 160),
          }}
          role="listbox"
          aria-label={ariaLabel}
        >
          {SUPPORTED_LOCALES.map((loc) => {
            const isActive = locale === loc;
            return (
              <button
                key={loc}
                type="button"
                role="option"
                aria-selected={isActive}
                data-locale={loc}
                onClick={handleOptionClick}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-inset',
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'
                    : 'text-zinc-600 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/50'
                )}
              >
                <Globe
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-zinc-500 dark:text-zinc-300'
                  )}
                  aria-hidden
                />
                <span className="truncate">{t(loc)}</span>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const LocaleDropdownPanel = memo(LocaleDropdownPanelInner);