'use client';

import { useMemo } from 'react';
import { useAuthActions } from './useAuthActions';
import { useAuthState } from './useAuthStore';

export const useAuth = () => {
  const store = useAuthState();
  const { login, logout, isLoggingIn } = useAuthActions();

  return useMemo(
    () => ({
      ...store,
      login,
      logout,
      isLoggingIn,
    }),
    [store, login, logout, isLoggingIn]
  );
};