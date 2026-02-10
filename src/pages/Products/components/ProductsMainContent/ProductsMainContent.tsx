import { useCallback } from 'react';
import { ProductsTableSkeleton } from '$components';
import { useProductsQuery } from '$hooks';
import { useProductsTable } from '$store';
import { ProductTable } from '../ProductTable';
import { ProductsSectionBar } from './components';

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
          <p className="text-base text-gray-500 m-0">{errorMessage}</p>
          <button
            type="button"
            onClick={handleRefetch}
            className="
              py-2 px-4 text-sm font-semibold bg-blue-600 text-white border-0
              rounded-lg cursor-pointer
              hover:bg-blue-700
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
          <p className="text-base text-gray-500 m-0">Нет товаров</p>
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
