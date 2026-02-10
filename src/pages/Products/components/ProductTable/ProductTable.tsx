import { memo, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { COLUMNS, ROW_HEIGHT, VIRTUAL_OVERSCAN } from '$constants';
import { useProductsQuery } from '$hooks';
import { useProductsTable } from '$store';
import { cn } from '$utils';
import { LoadMoreProgress } from '$components';
import { AddProductRow, ColGroup, ColumnHeader, ProductRow } from './components';
import { useAddProductForm, useInfiniteScroll, useTableResize } from '$hooks';

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

  const scrollContainerRef = useInfiniteScroll(onLoadMore, hasMore, loadingMore);
  const { tableContainerRef, resizing, handleResizeMouseDown } = useTableResize(onColumnResize);
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
        'flex flex-col bg-white h-full min-h-[300px] max-h-[calc(100vh-180px)]',
        resizing && 'cursor-col-resize'
      )}
    >
      <div className="shrink-0 border-b border-gray-200">
        <table className="
          w-full border-separate border-spacing-0 table-fixed
          [--row-height:48px]
        ">
          <ColGroup />
          <thead>
            <tr>
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
                text-sm text-gray-400 bg-white relative
              " />
            </tr>
          </thead>
        </table>
      </div>
      <div ref={scrollContainerRef} className="
        flex-1 min-h-0 overflow-auto table-scroll
      ">
        <div
          className="w-full relative min-w-0"
          style={{ height: totalSize, minHeight: totalSize }}
        >
          <table className="
            w-full border-separate border-spacing-0 table-fixed
            [--row-height:48px]
          ">
            <ColGroup />
            <tbody className="
              [&_tr:last-child_td]:border-b [&_tr:last-child_td]:border-gray-200
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
                    key={product._clientKey ?? product.id}
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
