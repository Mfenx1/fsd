import { DEFAULT_WIDTHS } from '$shared';

export interface ColumnWidthsSlice {
  columnWidths: Record<string, number>;
  setColumnWidth: (col: string, width: number) => void;
}

type SetState = (partial: unknown, ...args: unknown[]) => void;

export const createColumnWidthsSlice = (set: SetState): ColumnWidthsSlice => ({
  columnWidths: { ...DEFAULT_WIDTHS },
  setColumnWidth: (col, width) =>
    set(
      (state: { columnWidths: Record<string, number> }) => {
        state.columnWidths[col] = width;
      },
      false,
      'setColumnWidth'
    ),
});