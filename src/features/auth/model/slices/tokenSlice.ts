import type { SliceSetState } from '$shared';

export interface TokenSlice {
  token: string | null;
  setToken: (token: string | null) => void;
}


export const createTokenSlice = (set: SliceSetState<TokenSlice>): TokenSlice => ({
  token: null,

  setToken: (token) => set({ token }, false, 'setToken'),
});