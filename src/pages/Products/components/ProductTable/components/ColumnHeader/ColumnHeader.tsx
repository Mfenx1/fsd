import { memo, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useColumnWidth } from '$store';
import { ICON_COLOR_LIGHT } from '$constants';
import { cn } from '$utils';
interface ColumnHeaderProps {
  colKey: string;
  label: string;
  sortable: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
  onSort: (colKey: string) => void;
  onResizeMouseDown: (colKey: string) => (event: React.MouseEvent) => void;
}

const ColumnHeaderComponent = ({
  colKey,
  label,
  sortable,
  sortBy,
  order,
  onSort,
  onResizeMouseDown,
}: ColumnHeaderProps) => {
  const width = useColumnWidth(colKey);
  const handleSortClick = useCallback(() => onSort(colKey), [onSort, colKey]);
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => onResizeMouseDown(colKey)(e),
    [onResizeMouseDown, colKey]
  );
  const style = {
    '--col-width': `${width}px`,
    '--col-min-width': '60px',
  } as React.CSSProperties;

  return (
    <th
      className={cn(
        `
          col-resizable py-3 px-4 text-left align-middle font-semibold text-sm
          text-gray-400 bg-white relative
        `,
        `
          [&:not(:first-child)]:text-center
          [&:not(:first-child)_.sort-btn]:inline-flex
          [&:not(:first-child)_.sort-btn]:justify-center
          [&:not(:first-child)_.th-label]:inline-flex
          [&:not(:first-child)_.th-label]:justify-center
        `
      )}
      style={style}
      scope="col"
    >
      {sortable ? (
        <button
          type="button"
          className="
            sort-btn bg-transparent border-0 text-inherit font-inherit
            cursor-pointer p-0 inline-flex items-center gap-1 align-middle
            hover:text-gray-900
          "
          onClick={handleSortClick}
        >
          {label}
          {sortBy === colKey && (
            <span className="inline-flex items-center text-xs text-blue-600">
              {order === 'asc' ? (
                <ChevronUp size={14} color={ICON_COLOR_LIGHT} />
              ) : (
                <ChevronDown size={14} color={ICON_COLOR_LIGHT} />
              )}
            </span>
          )}
        </button>
      ) : (
        <span className="th-label text-inherit font-inherit">{label}</span>
      )}
      <button
        type="button"
        className="
          resize-handle absolute top-0 right-0 w-2 h-full p-0 m-0 border-0
          border-r border-transparent bg-transparent font-inherit
          cursor-col-resize
          hover:bg-blue-600/15 hover:border-r-blue-600
          active:bg-blue-600/15 active:border-r-blue-600
        "
        onMouseDown={handleResizeMouseDown}
        aria-label={`Изменить ширину столбца ${label}`}
        title="Перетащите для изменения ширины"
      />
    </th>
  );
};

export const ColumnHeader = memo(ColumnHeaderComponent);
