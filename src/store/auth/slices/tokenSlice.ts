import type { SliceSetState } from '../../utils';
import { getStoredToken } from '$lib';

export interface TokenSlice {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const createTokenSlice = (set: SliceSetState<TokenSlice>): TokenSlice => ({
  token: getStoredToken(),

  setToken: (token) => set({ token }, false, 'setToken'),
});
