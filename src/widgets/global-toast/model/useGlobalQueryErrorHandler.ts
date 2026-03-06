'use client';

import { useEffect } from 'react';
import {
  useQueryClient,
  type MutationCacheNotifyEvent,
  type QueryCacheNotifyEvent,
} from '@tanstack/react-query';
import { useGlobalToastStore } from './useGlobalToastStore';

const AUTH_ERROR_STATUSES = [401, 403];

const getErrorStatus = (error: unknown): number | undefined =>
  error != null && typeof (error as { status?: number }).status === 'number'
    ? (error as { status: number }).status
    : undefined;

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Ошибка запроса';

const isMutationUpdatedEvent = (
  event: MutationCacheNotifyEvent
): event is MutationCacheNotifyEvent & { type: 'updated'; mutation: { state: { status: 'error'; error: unknown } } } => {
  if (event.type !== 'updated') return false;
  const status = event.mutation?.state?.status;
  const error = event.mutation?.state?.error;

  return status === 'error' && error != null;
};

const isQueryUpdatedEventWithError = (
  event: QueryCacheNotifyEvent
): event is QueryCacheNotifyEvent & { type: 'updated'; query: { state: { status: 'error'; error: unknown } } } => {
  if (event.type !== 'updated') return false;
  const status = event.query?.state?.status;
  const error = event.query?.state?.error;

  return status === 'error' && error != null;
};

export const useGlobalQueryErrorHandler = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSetToast = () => useGlobalToastStore.getState().setToast;

    const showToastUnlessAuth = (error: unknown) => {
      const status = getErrorStatus(error);
      if (status != null && AUTH_ERROR_STATUSES.includes(status)) return;

      getSetToast()({ message: getErrorMessage(error), variant: 'error' });
    };

    const unsubMutation = queryClient.getMutationCache().subscribe((event: MutationCacheNotifyEvent) => {
      if (!isMutationUpdatedEvent(event)) return;
      showToastUnlessAuth(event.mutation.state.error);
    });

    const unsubQuery = queryClient.getQueryCache().subscribe((event: QueryCacheNotifyEvent) => {
      if (!isQueryUpdatedEventWithError(event)) return;
      showToastUnlessAuth(event.query.state.error);
    });

    return () => {
      unsubMutation();
      unsubQuery();
    };
  }, [queryClient]);
};