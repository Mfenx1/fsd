'use client';

import { memo, useCallback, useEffect, useRef, useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Globe } from 'lucide-react';
import { cn, type Locale } from '$shared';
import { LocaleDropdownPanel } from './LocaleDropdownPanel';

export const LocaleSwitcher = memo(({
  collapsed,
  className,
}: {
  collapsed: boolean;
  className?: string;
}) => {
  const t = useTranslations('shell.locale');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    async (value: Locale) => {
      if (value === locale) return;
      setOpen(false);
      setPendingLocale(value);
      const res = await fetch(`/api/set-locale?locale=${value}&redirect=none`, { credentials: 'include' });
      if (!res.ok) {
        setPendingLocale(null);
        return;
      }
      startTransition(() => router.refresh());
    },
    [locale, router]
  );

  useEffect(() => {
    if (pendingLocale && locale === pendingLocale) setPendingLocale(null);
  }, [locale, pendingLocale]);

  const handleToggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const rect = triggerRef.current?.getBoundingClientRect();
  const showDropdown = typeof document !== 'undefined' && rect;

  return (
    <div
      role="group"
      aria-label={t('aria')}
      className={cn(
        'w-full',
        collapsed && 'flex justify-center',
        className
      )}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('aria')}
        title={t(pendingLocale ?? locale)}
        className={cn(
          'flex items-center rounded-xl transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50',
          'focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-offset-zinc-900',
          'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100',
          collapsed ? 'justify-center w-10 h-10 p-0' : 'gap-2.5 px-3 py-2.5 w-full'
        )}
      >
        <Globe className="h-5 w-5 shrink-0" aria-hidden />
        {!collapsed && (
          <>
            <span className="flex-1 text-left text-sm font-medium truncate">
              {t(pendingLocale ?? locale)}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 transition-transform',
                open && 'rotate-180'
              )}
              aria-hidden
            />
          </>
        )}
      </button>
      {showDropdown && (
        <LocaleDropdownPanel
          open={open}
          locale={locale}
          onSelect={handleSelect}
          triggerRect={rect}
          panelRef={panelRef}
          ariaLabel={t('aria')}
          t={t}
        />
      )}
    </div>
  );
});