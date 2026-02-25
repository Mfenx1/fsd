import Link from 'next/link';
import { AppEmptyState, linkToHomeClass } from '../AppEmptyState';

export const NotFoundView = () => (
  <AppEmptyState title="Страница не найдена" message="Запрошенная страница не существует.">
    <Link href="/" className={linkToHomeClass}>
      На главную
    </Link>
  </AppEmptyState>
);