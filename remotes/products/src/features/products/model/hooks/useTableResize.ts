import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ACTIONS_COL_WIDTH,
  COLUMNS,
  FALLBACK_COL_WIDTH,
  throttle,
} from '$shared';
import { useProductsTableStore } from '..';

const MIN_COL_WIDTH = 60;
const RESIZE_THROTTLE_MS = 16;

export const useTableResize = (onColumnResize: (col: string, width: number) => void) => {
  const [resizing, setResizing] = useState<string | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startW = useRef(0);

  const handleResizeStart = useCallback((col: string, event: React.MouseEvent) => {
    event.preventDefault();
    setResizing(col);
    startX.current = event.clientX;
    const columnWidths = useProductsTableStore.getState().columnWidths;
    startW.current = columnWidths[col] ?? FALLBACK_COL_WIDTH;
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!resizing) return;
      const tableWidth = tableContainerRef.current?.clientWidth ?? 0;
      const availableWidth = Math.max(0, tableWidth - ACTIONS_COL_WIDTH);
      const columnWidths = useProductsTableStore.getState().columnWidths;
      const otherColumnsSum = COLUMNS.filter(({ key }) => key !== resizing).reduce(
        (sum, { key }) => sum + (columnWidths[key] ?? FALLBACK_COL_WIDTH),
        0
      );
      const maxWidth = Math.max(MIN_COL_WIDTH, availableWidth - otherColumnsSum);
      const deltaX = event.clientX - startX.current;
      const newW = Math.max(MIN_COL_WIDTH, Math.min(startW.current + deltaX, maxWidth));
      onColumnResize(resizing, newW);
      startX.current = event.clientX;
      startW.current = newW;
    },
    [resizing, onColumnResize]
  );

  const throttledMouseMoveRef = useRef<(event: MouseEvent) => void>(() => {});

  useEffect(() => {
    throttledMouseMoveRef.current = throttle(handleMouseMove, RESIZE_THROTTLE_MS);
  }, [handleMouseMove]);

  const handleMouseUp = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMouseMove = (event: MouseEvent) => throttledMouseMoveRef.current(event);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  const handleResizeMouseDown = useCallback(
    (colKey: string) => (event: React.MouseEvent) => {
      handleResizeStart(colKey, event);
    },
    [handleResizeStart]
  );

  return { tableContainerRef, resizing, handleResizeMouseDown };
};