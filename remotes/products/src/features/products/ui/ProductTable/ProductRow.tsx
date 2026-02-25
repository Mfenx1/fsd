import { memo, useCallback } from 'react';
import type { Product } from '$entities/product';
import { RATING_THRESHOLD, type ProductTableColumn } from '$shared';
import { useProductsUIStore, getProductValue } from '../../model';
import { cn, formatCellValue } from '$shared';
import { Image } from '$shared';
import { ProductRowEditForm } from './ProductRowEditForm';

interface ProductRowProps {
  product: Product;
  columns: readonly ProductTableColumn[];
  height: number;
  translateY: number;
}

const ProductRowComponent = ({
  product,
  columns,
  height,
  translateY,
}: ProductRowProps) => {
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
      if (event.key === 'Enter' || event.key === ' ')
        onEditingChange(product.id, product._clientKey);
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
        'relative z-0 bg-white dark:bg-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-700/50 transition-colors',
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
          const isTitle = key === 'title';
          const ratingNum = 
            isRating && typeof value === 'number' && Number.isFinite(value)
              ? value.toFixed(1)
              : null;
          const thumbnailUrl = product.thumbnail?.trim();
          const titleContent = isTitle ? (
            <span className="flex items-center gap-2 min-w-0">
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded object-cover shrink-0"
                />
              ) : (
                <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-700 shrink-0" aria-hidden />
              )}
              <span
                className={cn(
                  editable && 'cursor-pointer py-0.5 hover:bg-indigo-500/8 dark:hover:bg-indigo-400/10 truncate rounded'
                )}
                onClick={editable ? handleCellClick : undefined}
                onDoubleClick={editable ? handleCellClick : undefined}
                role={editable ? 'button' : undefined}
                tabIndex={editable ? 0 : undefined}
                onKeyDown={editable ? handleCellKeyDown : undefined}
              >
                {formatCellValue(value, key)}
              </span>
            </span>
          ) : (
            <span
              className={cn(
                editable && 'cursor-pointer py-0.5 hover:bg-indigo-500/8 dark:hover:bg-indigo-400/10 rounded'
              )}
              onClick={editable ? handleCellClick : undefined}
              onDoubleClick={editable ? handleCellClick : undefined}
              role={editable ? 'button' : undefined}
              tabIndex={editable ? 0 : undefined}
              onKeyDown={editable ? handleCellKeyDown : undefined}
            >
              {isRating && ratingNum != null ? (
                <>
                  <span className={cn(isLowRating && 'text-red-500 font-medium')}>
                    {ratingNum}
                  </span>
                  /5
                </>
              ) : (
                formatCellValue(value, key)
              )}
            </span>
          );

          return (
            <td
              key={key}
              className={cn(
                'py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b border-zinc-200/80 dark:border-zinc-700',
                !isTitle && '[&:not(:first-child)]:text-center'
              )}
            >
              {titleContent}
            </td>
          );
        })
      )}
      {!isRowEditing && (
        <td className="
          py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b
          border-zinc-200/80 dark:border-zinc-700
          [&:not(:first-child)]:text-center
        " />
      )}
    </tr>
  );
};

export const ProductRow = memo(ProductRowComponent);