'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  AUTH_BROADCAST_CHANNEL,
  AUTH_LOGIN_ERROR,
  ROUTES,
  useRouterAdapter,
  clearStoredToken,
  queryKeys,
  setStoredToken,
} from '$shared';
import { useAuthStore } from './useAuthStore';
import { loginAction } from '$app';

const fallbackNavigate = (to: string) => {
  if (typeof window !== 'undefined') window.location.href = to;
};

export const useAuthActions = () => {
  const routerAdapter = useRouterAdapter();
  const navigate = routerAdapter?.navigate ?? fallbackNavigate;
  const queryClient = useQueryClient();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const logout = useCallback(() => {
    const { token, setToken } = useAuthStore.getState();
    setToken(null);
    clearStoredToken();
    if (token) {
      queryClient.removeQueries({ queryKey: queryKeys.auth.me(token) });
    }
    if (typeof BroadcastChannel !== 'undefined') {
      new BroadcastChannel(AUTH_BROADCAST_CHANNEL).postMessage('logout');
    }
    navigate(ROUTES.LOGIN);
  }, [navigate, queryClient]);

  const login = useCallback(
    async (username: string, password: string, rememberMe: boolean): Promise<string | null> => {
      setIsLoggingIn(true);
      try {
        const result = await loginAction(username, password, rememberMe);
        if (!result.ok) {
          setIsLoggingIn(false);
          return result.error;
        }
        const { accessToken } = result.data;
        setStoredToken(accessToken, rememberMe);
        useAuthStore.getState().setToken(accessToken);
        queryClient.setQueryData(queryKeys.auth.me(accessToken), {
          id: result.data.id,
          username: result.data.username,
          email: result.data.email,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          image: result.data.image,
        });
        
        return null;
      } catch (e) {
        setIsLoggingIn(false);
        return e instanceof Error ? e.message : AUTH_LOGIN_ERROR;
      }
    },
    [navigate, queryClient]
  );

  return { login, logout, isLoggingIn };
};