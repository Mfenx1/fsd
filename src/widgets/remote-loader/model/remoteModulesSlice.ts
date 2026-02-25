export type RemoteModuleStatus = 'idle' | 'loading' | 'mounted' | 'error';

export interface RemoteModuleState {
  status: RemoteModuleStatus;
  version?: string;
  error?: string;
}

export interface RemoteModulesSlice {
  remotes: Record<string, RemoteModuleState>;
  setRemoteStatus: (name: string, state: Partial<RemoteModuleState>) => void;
}

export const createRemoteModulesSlice = (
  set: (fn: (state: RemoteModulesSlice) => Partial<RemoteModulesSlice>) => void
): RemoteModulesSlice => ({
  remotes: {},
  setRemoteStatus: (name, payload) =>
    set((state) => ({
      remotes: {
        ...state.remotes,
        [name]: { status: 'idle', ...state.remotes[name], ...payload },
      },
    })),
});