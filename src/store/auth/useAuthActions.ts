import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_BROADCAST_CHANNEL, AUTH_LOGIN_ERROR, ROUTES } from '$constants';
import { useLoginMutation } from '$hooks';
import { clearStoredToken, queryKeys, setStoredToken } from '$lib';
import { useAuthStore } from './useAuthStore';

export const useAuthActions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();

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
      try {
        const data = await loginMutation.mutateAsync({ username, password, rememberMe });
        setStoredToken(data.accessToken, rememberMe);
        useAuthStore.getState().setToken(data.accessToken);
        navigate(ROUTES.PRODUCTS);

        return null;
      } catch (e) {
        return e instanceof Error ? e.message : AUTH_LOGIN_ERROR;
      }
    },
    [loginMutation, navigate]
  );

  return { login, logout, isLoggingIn: loginMutation.isPending };
};
