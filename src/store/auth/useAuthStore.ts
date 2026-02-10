import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { withDevtools } from '../utils';
import type { SliceSetState } from '../utils';
import { createTokenSlice, createUserSlice } from './slices';
import type { TokenSlice, UserSlice } from './slices';

export type AuthStore = TokenSlice & UserSlice;

export const useAuthStore = create<AuthStore>()(
  withDevtools<AuthStore>('Auth')((set) => ({
    ...createTokenSlice(set as SliceSetState<TokenSlice>),
    ...createUserSlice(set as SliceSetState<UserSlice>),
  }))
);

export const useAuthState = () =>
  useAuthStore(
    useShallow((s) => ({
      user: s.user,
      token: s.token,
      isLoading: s.isLoading,
    }))
  );
