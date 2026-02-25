import type { AuthUser } from '$entities/user';
import type { SliceSetState } from '$shared';

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