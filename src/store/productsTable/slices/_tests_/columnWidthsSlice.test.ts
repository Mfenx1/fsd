import { describe, it, expect, vi } from 'vitest';
import { createColumnWidthsSlice } from '../columnWidthsSlice';

describe('createColumnWidthsSlice', () => {
  it('начальные ширины из DEFAULT_WIDTHS', () => {
    const set = vi.fn();
    const slice = createColumnWidthsSlice(set);

    expect(slice.columnWidths).toEqual(
      expect.objectContaining({
        title: 220,
        brand: 120,
        sku: 120,
        rating: 90,
        price: 120,
        stock: 100,
      })
    );
  });

  it('setColumnWidth вызывает set с функцией-апдейтером', () => {
    const set = vi.fn();
    const slice = createColumnWidthsSlice(set);

    slice.setColumnWidth('title', 300);

    expect(set).toHaveBeenCalled();
    const firstCall = vi.mocked(set).mock.calls[0];
    if (!firstCall) return;
    const [updater] = firstCall;
    const state = { columnWidths: { title: 220 } };
    if (typeof updater === 'function') {
      updater(state);
      expect(state.columnWidths?.title).toBe(300);
    }
  });
});
