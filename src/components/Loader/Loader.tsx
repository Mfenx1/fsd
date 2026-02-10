import { memo } from 'react';

interface LoaderProps {
  size?: 'default' | 'sm';
}

const LoaderComponent = ({ size = 'default' }: LoaderProps) => (
  <div
    className={
      size === 'sm'
        ? 'inline-flex items-center justify-center'
        : 'flex items-center justify-center min-h-full py-8'
    }
  >
    <div
      className={
        size === 'sm'
          ? 'loader-spinner-sm w-[1.125rem] h-[1.125rem]'
          : 'loader-spinner w-10 h-10'
      }
      aria-label="Загрузка"
    />
  </div>
);

export const Loader = memo(LoaderComponent);
