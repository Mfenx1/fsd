import { describe, it, expect, vi } from 'vitest';
import { createSortSlice } from '../sortSlice';

describe('createSortSlice', () => {
  it('начальное sortBy и order', () => {
    const set = vi.fn();
    const slice = createSortSlice(set);

    expect(slice.sortBy).toBe('title');
    expect(slice.order).toBe('asc');
  });

  it('setSort вызывает set с новыми sortBy и order', () => {
    const set = vi.fn();
    const slice = createSortSlice(set);

    slice.setSort('price', 'desc');

    expect(set).toHaveBeenCalledWith({ sortBy: 'price', order: 'desc' }, false, 'setSort');
  });
});
