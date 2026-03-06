'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { PanelLeftClose, PanelLeft, Info } from 'lucide-react';
import { cn } from '$shared';
import { useSidebarWidthStore, SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from '../model';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeSwitcher } from '$widgets';

export interface ShellSidebarLink {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export interface ShellSidebarProps {
  title: string;
  links: readonly ShellSidebarLink[];
  activeHref: string;
  onLogout: () => void;
  
  LinkComponent: ComponentType<{
    href: string;
    children: ReactNode;
    className?: string;
    title?: string;
  }>;
  logoutLabel?: string;
  logoutIcon?: ReactNode;
  
  footer?: ReactNode;
  
  aboutLabel?: string;
  onAboutClick?: () => void;
}

export const ShellSidebar = ({
  title,
  links,
  activeHref,
  onLogout,
  LinkComponent,
  logoutLabel = 'Выход',
  logoutIcon,
  footer,
  aboutLabel,
  onAboutClick,
}: ShellSidebarProps) => {
  const t = useTranslations('shell.sidebar');
  const [collapsed, setCollapsed] = useState(true);
  const setWidth = useSidebarWidthStore((s) => s.setWidth);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  useEffect(() => {
    setWidth(collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED);
  }, [collapsed, setWidth]);

  return (
    <aside
      className={cn(
        'shrink-0 flex flex-col border-r transition-[width] duration-300 ease-in-out overflow-hidden',
        'bg-zinc-100 text-zinc-700 border-zinc-200',
        'dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800/80',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div
        className={cn(
          'shrink-0 border-b flex items-center transition-all duration-200',
          'border-zinc-200 dark:border-zinc-800/80',
          collapsed ? 'justify-center p-4' : 'px-5 py-5'
        )}
      >
        {collapsed ? (
          <span className="text-lg font-bold text-zinc-900 dark:text-white">{title.slice(0, 1)}</span>
        ) : (
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white whitespace-nowrap">
            {title}
          </span>
        )}
      </div>
      <nav
        className={cn(
          'flex-1 p-3 gap-0.5 flex flex-col min-h-0',
          collapsed && 'items-center'
        )}
      >
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = activeHref === href;
          return (
            <LinkComponent
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                collapsed ? 'justify-center w-10 h-10 p-0' : 'gap-3 px-3 py-2.5 w-full',
                isActive
                  ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100'
              )}
            >
              <Icon
                className={cn('h-5 w-5 shrink-0', isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-300')}
                aria-hidden
              />
              {!collapsed && <span className="truncate">{label}</span>}
            </LinkComponent>
          );
        })}
      </nav>
      {footer && !collapsed && footer}
      <div
        className={cn(
          'p-3 border-t border-zinc-200 dark:border-zinc-800/80 space-y-0.5 shrink-0',
          collapsed && 'flex flex-col items-center'
        )}
      >
        <ThemeSwitcher collapsed={collapsed} className="mb-2" />
        <LocaleSwitcher collapsed={collapsed} className="mb-2" />
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'flex items-center rounded-xl text-zinc-600 transition-all duration-200 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100',
            collapsed ? 'justify-center w-10 h-10 p-0' : 'gap-3 px-3 py-2.5 w-full'
          )}
          title={collapsed ? t('expand') : t('collapse')}
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-300" aria-hidden />
          ) : (
            <PanelLeftClose className="h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-300" aria-hidden />
          )}
          {!collapsed && <span>{t('collapseShort')}</span>}
        </button>
        {aboutLabel != null && onAboutClick != null && (
          <button
            type="button"
            onClick={onAboutClick}
            title={collapsed ? aboutLabel : undefined}
            className={cn(
              'flex items-center rounded-xl text-zinc-600 transition-all duration-200 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100',
              collapsed ? 'justify-center w-10 h-10 p-0' : 'gap-3 px-3 py-2.5 w-full'
            )}
          >
            <Info className="h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-300" aria-hidden />
            {!collapsed && <span className="truncate">{aboutLabel}</span>}
          </button>
        )}
        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? logoutLabel : undefined}
          className={cn(
            'flex items-center rounded-xl text-zinc-600 transition-all duration-200 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100',
            collapsed ? 'justify-center w-10 h-10 p-0' : 'gap-3 px-3 py-2.5 w-full'
          )}
        >
          {logoutIcon ?? null}
          {!collapsed && <span className="truncate">{logoutLabel}</span>}
        </button>
      </div>
    </aside>
  );
};