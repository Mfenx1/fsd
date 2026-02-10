import type { AuthUser } from '$types';
import type { SliceSetState } from '../../utils';

export interface UserSlice {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const createUserSlice = (set: SliceSetState<UserSlice>): UserSlice => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }, false, 'setUser'),
  setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
});
