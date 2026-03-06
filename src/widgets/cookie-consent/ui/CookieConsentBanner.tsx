'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { Cookie, ChevronDown, Settings2, Shield, BarChart3, Megaphone } from 'lucide-react';
import {
  cn,
  CONSENT,
  DEFAULT_CATEGORIES,
  getConsentCategories,
  getCookieConsent,
  setCookieConsent,
  type ConsentCategories,
} from '$shared';
import { useSidebarWidthStore } from '$widgets/shell-sidebar';

const CATEGORY_KEYS = ['necessary', 'functional', 'analytics', 'marketing'] as const;

const CATEGORY_ICONS = {
  necessary: Shield,
  functional: Settings2,
  analytics: BarChart3,
  marketing: Megaphone,
} as const;

const BTN =
  'px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-elevated)]';

const BTN_SECONDARY =
  BTN +
  ' text-[var(--color-text)] bg-[var(--color-border-subtle)] hover:bg-[var(--color-border)] ' +
  'dark:bg-white/10 dark:hover:bg-white/15';

const BTN_PRIMARY =
  BTN +
  ' bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] ' +
  'shadow-sm hover:shadow-md hover:-translate-y-px';

const BTN_ICON =
  'p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border-subtle)] ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]';

const BANNER_BASE =
  'fixed bottom-0 right-0 z-[100] rounded-t-2xl ' +
  'bg-[var(--color-surface-elevated)]/95 backdrop-blur-xl border border-b-0 border-[var(--color-border)] ' +
  'shadow-[0_-8px_32px_rgba(0,0,0,0.12),0_-2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.4)]';

type ActionButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
};

const ActionButton = ({ onClick, children, primary }: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={primary ? BTN_PRIMARY : BTN_SECONDARY}
  >
    {children}
  </button>
);

type CategoryRowProps = {
  keyId: (typeof CATEGORY_KEYS)[number];
  checked: boolean;
  onToggleKey: (key: keyof ConsentCategories) => void;
  label: string;
  description: string;
};

const CategoryRow = ({ keyId, checked, onToggleKey, label, description }: CategoryRowProps) => {
  const handleToggle = useCallback(() => onToggleKey(keyId), [onToggleKey, keyId]);
  const Icon = CATEGORY_ICONS[keyId];
  const disabled = keyId === 'necessary';
  return (
    <label
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200',
        'bg-[var(--color-border-subtle)]/50 hover:bg-[var(--color-border-subtle)]',
        disabled && 'opacity-90 cursor-default'
      )}
    >
      <span className="mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          disabled={disabled}
          className="checkbox-custom"
        />
      </span>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Icon
          className={cn(
            'h-5 w-5 shrink-0 mt-0.5',
            checked ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
          )}
        />
        <div>
          <span
            className={cn(
              'text-sm font-medium',
              checked ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
            )}
          >
            {label}
          </span>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </label>
  );
};

export const CookieConsentBanner = () => {
  const t = useTranslations('cookieConsent');
  const pathname = usePathname();
  const sidebarWidth = useSidebarWidthStore((s) => s.width);
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [categories, setCategories] = useState<ConsentCategories>(DEFAULT_CATEGORIES);
  const leftInset = pathname?.startsWith('/login') ? 0 : sidebarWidth;

  useEffect(() => {
    if (getCookieConsent() === null) setVisible(true);
  }, []);

  const applyAndClose = useCallback(
    (value: Parameters<typeof setCookieConsent>[0]) => {
      setCookieConsent(value);
      setVisible(false);
      setShowCustomize(false);
    },
    []
  );

  const openCustomize = useCallback(() => {
    setCategories(
      getCookieConsent() === null ? DEFAULT_CATEGORIES : getConsentCategories()
    );
    setShowCustomize(true);
  }, []);

  const toggleCategory = useCallback((key: keyof ConsentCategories) => {
    if (key === 'necessary') return;
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleReject = useCallback(() => applyAndClose(CONSENT.NECESSARY), [applyAndClose]);
  const handleAccept = useCallback(() => applyAndClose(CONSENT.ALL), [applyAndClose]);
  const handleCloseCustomize = useCallback(() => setShowCustomize(false), []);
  const handleSaveCustom = useCallback(() => applyAndClose(categories), [applyAndClose, categories]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby={showCustomize ? undefined : 'cookie-consent-desc'}
          initial={{ y: '100%', opacity: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className={BANNER_BASE}
          style={{ left: leftInset, transition: 'left 300ms ease-in-out' }}
        >
          <div className="mx-auto max-w-3xl p-5 sm:p-6 flex flex-col gap-5">
            {!showCustomize ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Cookie className="h-6 w-6" aria-hidden />
                  </div>
                  <div className="pt-0.5">
                    <h2
                      id="cookie-consent-title"
                      className="text-base font-semibold text-[var(--color-text)] leading-tight"
                    >
                      {t('title')}
                    </h2>
                    <p
                      id="cookie-consent-desc"
                      className="text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed"
                    >
                      {t('description')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5 shrink-0 sm:flex-nowrap">
                  <ActionButton onClick={handleReject}>
                    {t('reject')}
                  </ActionButton>
                  <ActionButton onClick={openCustomize}>{t('customize')}</ActionButton>
                  <ActionButton onClick={handleAccept} primary>
                    {t('accept')}
                  </ActionButton>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                <div className="flex items-center justify-between">
                  <h2
                    id="cookie-consent-title"
                    className="text-base font-semibold text-[var(--color-text)] flex items-center gap-2"
                  >
                    <Settings2 className="h-5 w-5 text-[var(--color-primary)]" />
                    {t('customize')}
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseCustomize}
                    className={BTN_ICON}
                    aria-label={t('cancel')}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid gap-2.5 max-h-52 overflow-y-auto pr-1 table-scroll">
                  {CATEGORY_KEYS.map((key) => (
                    <CategoryRow
                      key={key}
                      keyId={key}
                      checked={categories[key]}
                      onToggleKey={toggleCategory}
                      label={t(`categories.${key}`)}
                      description={t(`categories.${key}Desc`)}
                    />
                  ))}
                </div>
                <div className="flex gap-2.5 justify-end pt-1">
                  <ActionButton onClick={handleCloseCustomize}>
                    {t('cancel')}
                  </ActionButton>
                  <ActionButton onClick={handleSaveCustom} primary>
                    {t('save')}
                  </ActionButton>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};