import { create } from 'zustand';
import { createRemoteModulesSlice } from './remoteModulesSlice';
import type { RemoteModulesSlice } from './remoteModulesSlice';

export const useRemoteModulesStore = create<RemoteModulesSlice>()((set) => ({
  ...createRemoteModulesSlice(set),
}));