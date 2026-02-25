import type React from 'react';
import { memo, useRef } from 'react';
import { EMPTY_CELL, ErrorTooltip, cn } from '$shared';
import { ProductRowActions } from './ProductRowActions';

interface AddProductRowProps {
  values: { title: string; price: string; brand: string; sku: string };
  errors: Record<string, string>;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBrandChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSkuChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const AddProductRowComponent = ({
  values,
  errors,
  onTitleChange,
  onBrandChange,
  onSkuChange,
  onPriceChange,
  onSubmit,
  onCancel,
}: AddProductRowProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const brandRef = useRef<HTMLInputElement>(null);
  const skuRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  return (
    <tr className="
      relative z-0 bg-white dark:bg-zinc-800 h-12 min-h-12 max-h-12 product-row-with-tooltip
    ">
      <td className="
        py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b
        border-zinc-200/80 dark:border-zinc-700 [&:not(:first-child)]:text-center
      ">
        <div className="relative flex flex-col gap-1">
          <input
            ref={titleRef}
            value={values.title}
            onChange={onTitleChange}
            placeholder="Наименование"
            className={cn(
              'w-full min-h-6 py-1.5 px-3 text-sm bg-white dark:bg-zinc-700 border rounded-lg text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500/30',
              errors.title ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600 focus:border-indigo-400'
            )}
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'add-title-error' : undefined}
          />
          {errors.title && (
            <ErrorTooltip
              id="add-title-error"
              message={errors.title}
              anchorRef={titleRef}
              role="alert"
            />
          )}
        </div>
      </td>
      <td className="
        py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b
        border-zinc-200/80 dark:border-zinc-700 [&:not(:first-child)]:text-center
      ">
        <div className="relative flex flex-col gap-1">
          <input
            ref={brandRef}
            value={values.brand}
            onChange={onBrandChange}
            placeholder="Вендор"
            className={cn(
              'w-full min-h-6 py-1.5 px-3 text-sm bg-white dark:bg-zinc-700 border rounded-lg text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500/30',
              errors.brand ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600 focus:border-indigo-400'
            )}
            aria-invalid={errors.brand ? 'true' : 'false'}
            aria-describedby={errors.brand ? 'add-brand-error' : undefined}
          />
          {errors.brand && (
            <ErrorTooltip
              id="add-brand-error"
              message={errors.brand}
              anchorRef={brandRef}
              role="alert"
            />
          )}
        </div>
      </td>
      <td className="
        py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b
        border-zinc-200/80 dark:border-zinc-700 [&:not(:first-child)]:text-center
      ">
        <div className="relative flex flex-col gap-1">
          <input
            ref={skuRef}
            value={values.sku}
            onChange={onSkuChange}
            placeholder="Артикул"
            className={cn(
              'w-full min-h-6 py-1.5 px-3 text-sm bg-white dark:bg-zinc-700 border rounded-lg text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500/30',
              errors.sku ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600 focus:border-indigo-400'
            )}
            aria-invalid={errors.sku ? 'true' : 'false'}
            aria-describedby={errors.sku ? 'add-sku-error' : undefined}
          />
          {errors.sku && (
            <ErrorTooltip
              id="add-sku-error"
              message={errors.sku}
              anchorRef={skuRef}
              role="alert"
            />
          )}
        </div>
      </td>
      <td className="
        py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b
        border-zinc-200/80 dark:border-zinc-700 [&:not(:first-child)]:text-center
      ">{EMPTY_CELL}</td>
      <td className="
        py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b
        border-zinc-200/80 dark:border-zinc-700 [&:not(:first-child)]:text-center
      ">
        <div className="relative flex flex-col gap-1">
          <input
            ref={priceRef}
            type="text"
            inputMode="decimal"
            value={values.price}
            onChange={onPriceChange}
            placeholder="Цена"
            className={cn(
              'w-full min-h-6 py-1.5 px-3 text-sm bg-white dark:bg-zinc-700 border rounded-lg text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500/30',
              errors.price ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600 focus:border-indigo-400'
            )}
            aria-invalid={errors.price ? 'true' : 'false'}
            aria-describedby={errors.price ? 'add-price-error' : undefined}
          />
          {errors.price && (
            <ErrorTooltip
              id="add-price-error"
              message={errors.price}
              anchorRef={priceRef}
              role="alert"
            />
          )}
        </div>
      </td>
      <td className="
        py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b
        border-zinc-200/80 dark:border-zinc-700 [&:not(:first-child)]:text-center
      ">{EMPTY_CELL}</td>
      <td className="
        py-1.5 px-4 text-sm text-zinc-900 dark:text-zinc-100 align-middle bg-white dark:bg-zinc-800 border-b
        border-zinc-200/80 dark:border-zinc-700 [&:not(:first-child)]:text-center
      ">
        <ProductRowActions onSave={onSubmit} onCancel={onCancel} />
      </td>
    </tr>
  );
};

export const AddProductRow = memo(AddProductRowComponent);