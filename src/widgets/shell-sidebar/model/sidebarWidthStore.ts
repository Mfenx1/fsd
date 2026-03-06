import { create } from 'zustand';

export const SIDEBAR_WIDTH_COLLAPSED = 72;
export const SIDEBAR_WIDTH_EXPANDED = 256;

interface SidebarWidthStore {
  width: number;
  setWidth: (width: number) => void;
}

export const useSidebarWidthStore = create<SidebarWidthStore>((set) => ({
  width: SIDEBAR_WIDTH_COLLAPSED,
  setWidth: (width) => set({ width }),
}));