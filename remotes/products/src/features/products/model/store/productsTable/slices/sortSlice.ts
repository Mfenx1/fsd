import type { SortOrder } from '$entities/product';

export interface SortSlice {
  sortBy: string;
  order: SortOrder;
  setSort: (sortBy: string, order: SortOrder) => void;
}

type SetState = (partial: unknown, ...args: unknown[]) => void;

export const createSortSlice = (set: SetState): SortSlice => ({
  sortBy: 'title',
  order: 'asc',
  setSort: (sortBy, order) => set({ sortBy, order }, false, 'setSort'),
});