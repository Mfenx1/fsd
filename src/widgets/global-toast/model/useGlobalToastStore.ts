import { create } from 'zustand';
import { createGlobalToastSlice } from './globalToastSlice';
import type { GlobalToastSlice } from './globalToastSlice';

export const useGlobalToastStore = create<GlobalToastSlice>()((set) => ({
  ...createGlobalToastSlice(set),
}));