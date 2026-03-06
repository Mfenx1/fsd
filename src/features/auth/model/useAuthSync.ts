'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMeQuery } from './useMeQuery';
import { AUTH_BROADCAST_CHANNEL, getStoredToken, queryKeys, removeTokenFromStorage } from '$shared';
import { useAuthStore } from './useAuthStore';

export const useAuthSync = () => {
  const queryClient = useQueryClient();
  const { token, setToken, setUser, setLoading } = useAuthStore();
  const { data: user, isLoading: isMeLoading, isError: isMeError } = useMeQuery(token);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const current = useAuthStore.getState().token;
    if (current === null) {
      const stored = getStoredToken();
      if (stored) setToken(stored);
    }
  }, [setToken]);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
    const handler = (e: MessageEvent) => {
      if (e.data === 'logout') useAuthStore.getState().setToken(null);
    };
    channel.addEventListener('message', handler);

    return () => {
      channel.removeEventListener('message', handler);
      channel.close();
    };
  }, []);

  useEffect(() => {
    setUser(user ?? null);
    setLoading(Boolean(token) && isMeLoading);
  }, [user, token, isMeLoading, setUser, setLoading]);

  useEffect(() => {
    if (isMeError && token) {
      const tokenToRemove = token;
      queueMicrotask(() => {
        removeTokenFromStorage();
        setToken(null);
        queryClient.removeQueries({ queryKey: queryKeys.auth.me(tokenToRemove) });
      });
    }
  }, [isMeError, token, queryClient, setToken]);
};