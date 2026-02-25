'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const SkipLink = () => {
  const t = useTranslations('a11y');

  return (
    <Link
      href="#main"
      className="skip-link"
    >
      {t('skipToContent')}
    </Link>
  );
};