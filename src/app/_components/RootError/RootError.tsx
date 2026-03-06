'use client';

import Link from 'next/link';
import { AppEmptyState, primaryButtonClass, secondaryLinkClass } from '../AppEmptyState';

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export const RootError = ({ error, reset }: RootErrorProps) => (
  <AppEmptyState title="Что-то пошло не так" message={error.message} alert>
    <button type="button" className={primaryButtonClass} onClick={reset}>
      Попробовать снова
    </button>
    <Link href="/" className={secondaryLinkClass}>
      На главную
    </Link>
  </AppEmptyState>
);