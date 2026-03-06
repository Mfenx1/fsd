import { memo, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  COLUMNS,
  ROW_HEIGHT,
  VIRTUAL_OVERSCAN,
  ACTIONS_COL_WIDTH,
  cn,
  LoadMoreProgress,
} from '$shared';
import {
  useProductsQuery,
  useProductsTable,
  useProductsTableStore,
  useAddProductForm,
  useInfiniteScroll,
  useTableResize,
} from '../../model';
import { AddProductRow } from './AddProductRow';
import { ColGroup } from './ColGroup';
import { ColumnHeader } from './ColumnHeader';
import { ProductRow } from './ProductRow';

const ProductTableComponent = () => {
  const { products, onLoadMore, hasMore, loadingMore } = useProductsQuery();
  const {
    onColumnResize,
    onSort,
    sortBy,
    order,
    addingNew,
    onAdd,
    onAddCancel,
  } = useProductsTable();
  const columnWidths = useProductsTableStore((s) => s.columnWidths);
  const tableMinWidth =
    COLUMNS.reduce((sum, { key }) => sum + (columnWidths[key] ?? 120), 0) +
    ACTIONS_COL_WIDTH;

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useInfiniteScroll(onLoadMore, hasMore, loadingMore);
  const { tableContainerRef, resizing, handleResizeMouseDown } =
    useTableResize(onColumnResize);

  useEffect(() => {
    const body = scrollContainerRef.current;
    const header = headerScrollRef.current;
    if (!body || !header) return;
    const sync = () => {
      header.scrollLeft = body.scrollLeft;
    };
    body.addEventListener('scroll', sync);
    return () => body.removeEventListener('scroll', sync);
  }, [scrollContainerRef]);
  const { newRow, addErrors, fieldHandlers, handleAddSubmit } = useAddProductForm(
    onAdd,
    addingNew
  );

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: VIRTUAL_OVERSCAN,
    paddingStart: addingNew ? ROW_HEIGHT : 0,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  useEffect(() => {
    if (addingNew) {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [addingNew, scrollContainerRef]);

  return (
    <div
      ref={tableContainerRef}
      className={cn(
        'flex flex-col bg-white dark:bg-zinc-800 h-full min-h-[300px] max-h-[calc(100vh-180px)] rounded-xl overflow-hidden',
        resizing && 'cursor-col-resize'
      )}
    >
      <div
        ref={headerScrollRef}
        className="shrink-0 overflow-x-auto overflow-y-hidden table-scroll table-scroll-header border-b border-zinc-200 dark:border-zinc-700"
      >
        <table
          className="border-separate border-spacing-0 table-fixed [--row-height:48px]"
          style={{ width: '100%', minWidth: tableMinWidth }}
        >
          <ColGroup />
          <thead>
            <tr className="bg-white dark:bg-zinc-800 shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
              {COLUMNS.map(({ key, label, sortable }) => (
                <ColumnHeader
                  key={key}
                  colKey={key}
                  label={label}
                  sortable={sortable}
                  sortBy={sortBy}
                  order={order}
                  onSort={onSort}
                  onResizeMouseDown={handleResizeMouseDown}
                />
              ))}
              <th className="
                w-20 min-w-[80px] py-3 px-4 text-left align-middle font-semibold
                text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 relative
              " />
            </tr>
          </thead>
        </table>
      </div>
      <div
        ref={scrollContainerRef}
        className="
        flex-1 min-h-0 overflow-auto table-scroll
      "
      >
        <div
          className="relative min-w-0"
          style={{ height: totalSize, minHeight: totalSize, width: '100%', minWidth: tableMinWidth }}
        >
          <table
            className="border-separate border-spacing-0 table-fixed [--row-height:48px]"
            style={{ width: '100%', minWidth: tableMinWidth }}
          >
            <ColGroup />
            <tbody className="
              [&_tr:last-child_td]:border-b [&_tr:last-child_td]:border-zinc-200 dark:[&_tr:last-child_td]:border-zinc-700
            ">
              {addingNew && (
                <AddProductRow
                  values={newRow}
                  errors={addErrors}
                  onTitleChange={fieldHandlers.title}
                  onBrandChange={fieldHandlers.brand}
                  onSkuChange={fieldHandlers.sku}
                  onPriceChange={fieldHandlers.price}
                  onSubmit={handleAddSubmit}
                  onCancel={onAddCancel}
                />
              )}
              {virtualItems.map((virtualRow, index) => {
                const product = products[virtualRow.index];
                if (!product) return null;
                const offset = addingNew ? ROW_HEIGHT : 0;
                const translateY = virtualRow.start - offset - index * virtualRow.size;

                return (
                  <ProductRow
                    key={product._clientKey ?? `${product.id}-${virtualRow.index}`}
                    product={product}
                    columns={COLUMNS}
                    height={virtualRow.size}
                    translateY={translateY}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        {loadingMore && <LoadMoreProgress />}
      </div>
    </div>
  );
};

export const ProductTable = memo(ProductTableComponent);