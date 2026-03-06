import { useCallback } from 'react';
import { useProductsQuery, useProductsTable } from '../model';
import { ProductTable } from './ProductTable/ProductTable';
import { ProductsTableSkeleton } from './ProductsTableSkeleton';
import { ProductsSectionBar } from './ProductsSectionBar';

export const ProductsMainContent = () => {
  const { loading, errorMessage, products, onRefetch } = useProductsQuery();
  const { addingNew, onAddClick } = useProductsTable();

  const handleRefetch = useCallback(() => onRefetch(), [onRefetch]);

  if (loading) {
    return (
      <>
        <ProductsSectionBar onAddClick={onAddClick} />
        <div className="flex-1 min-h-0 flex flex-col">
          <ProductsTableSkeleton />
        </div>
      </>
    );
  }
  if (errorMessage) {
    return (
      <>
        <ProductsSectionBar onAddClick={onAddClick} />
        <div className="
          flex-1 flex flex-col items-center justify-center gap-4 py-12 px-6
          text-center
        ">
          <p className="text-base text-zinc-500 dark:text-zinc-400 m-0">{errorMessage}</p>
          <button
            type="button"
            onClick={handleRefetch}
            className="
              py-2 px-4 text-sm font-medium bg-indigo-500 dark:bg-indigo-400 text-white border-0
              rounded-xl cursor-pointer transition-colors
              hover:bg-indigo-600 dark:hover:bg-indigo-300
            "
          >
            Повторить
          </button>
        </div>
      </>
    );
  }
  if (products.length === 0 && !addingNew) {
    return (
      <>
        <ProductsSectionBar onAddClick={onAddClick} />
        <div className="
          flex-1 flex flex-col items-center justify-center gap-4 py-12 px-6
          text-center
        ">
          <p className="text-base text-zinc-500 dark:text-zinc-400 m-0">Нет товаров</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ProductsSectionBar onAddClick={onAddClick} />
      <div className="flex-1 min-h-0 flex flex-col">
        <ProductTable />
      </div>
    </>
  );
};