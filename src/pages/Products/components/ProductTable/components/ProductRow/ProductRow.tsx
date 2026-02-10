import { memo, useCallback } from 'react';
import type { Product } from '$types';
import { RATING_THRESHOLD, type ProductTableColumn } from '$constants';
import { useProductsUIStore } from '$store';
import { cn, formatCellValue, getProductValue } from '$utils';
import { ProductRowEditForm } from '../ProductRowEditForm';

interface ProductRowProps {
  product: Product;
  columns: readonly ProductTableColumn[];
  height: number;
  translateY: number;
}

const ProductRowComponent = ({ product, columns, height, translateY }: ProductRowProps) => {
  const isRowEditing = useProductsUIStore(
    (s) =>
      s.editing != null &&
      s.editing.id === product.id &&
      (product._clientKey == null || s.editing.clientKey === product._clientKey)
  );
  const setEditing = useProductsUIStore((s) => s.setEditing);
  const onEditingChange = useCallback(
    (id: number | null, clientKey?: string) =>
      setEditing(id != null ? { id, clientKey } : null),
    [setEditing]
  );

  const handleCellClick = useCallback(
    () => onEditingChange(product.id, product._clientKey),
    [onEditingChange, product.id, product._clientKey]
  );

  const handleCellKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') onEditingChange(product.id, product._clientKey);
    },
    [onEditingChange, product.id, product._clientKey]
  );
  const isLowRating =
    typeof product.rating === 'number' && product.rating < RATING_THRESHOLD;

  const virtualStyle = {
    height: `${height}px`,
    minHeight: `${height}px`,
    maxHeight: `${height}px`,
    transform: `translateY(${translateY}px)`,
  } as React.CSSProperties;

  return (
    <tr
      className={cn(
        `
          relative z-0 bg-white
          hover:bg-white
        `,
        isRowEditing && 'product-row-with-tooltip'
      )}
      style={virtualStyle}
    >
      {isRowEditing ? (
        <ProductRowEditForm key={product.id} product={product} columns={columns} />
      ) : (
        columns.map(({ key, editable }) => {
          const value = getProductValue(product, key);
          const isRating = key === 'rating';
          const ratingNum =
            isRating && typeof value === 'number' && Number.isFinite(value)
              ? value.toFixed(1)
              : null;

          return (
            <td
              key={key}
              className="
                py-3 px-4 text-sm text-gray-900 align-middle bg-white border-b
                border-gray-200
                [&:not(:first-child)]:text-center
              "
            >
              <span
                className={cn(editable && `
                  cursor-pointer py-0.5
                  hover:bg-blue-600/8
                `)}
                onClick={editable ? handleCellClick : undefined}
                onDoubleClick={editable ? handleCellClick : undefined}
                role={editable ? 'button' : undefined}
                tabIndex={editable ? 0 : undefined}
                onKeyDown={editable ? handleCellKeyDown : undefined}
              >
                {isRating && ratingNum != null ? (
                  <>
                    <span className={cn(isLowRating && `
                      text-red-500 font-medium
                    `)}>
                      {ratingNum}
                    </span>
                    /5
                  </>
                ) : (
                  formatCellValue(value, key)
                )}
              </span>
            </td>
          );
        })
      )}
      {!isRowEditing && (
        <td className="
          py-3 px-4 text-sm text-gray-900 align-middle bg-white border-b
          border-gray-200
          [&:not(:first-child)]:text-center
        " />
      )}
    </tr>
  );
};

export const ProductRow = memo(ProductRowComponent);
