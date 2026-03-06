import { useMutation, useQuery } from '@tanstack/react-query';

import { ERRORS, RECONNECT_MODE } from '$shared/constants';

import { useChatConnection } from './ChatConnectionContext';
import { INITIAL_STATE, QUERY_KEY_MESSAGES } from './chatApiConstants';
import { connectionState } from './connectionState';

export { QUERY_KEY_MESSAGES } from './chatApiConstants';

export const useMessagesQuery = () =>
  useQuery({
    queryKey: QUERY_KEY_MESSAGES,
    queryFn: () => Promise.resolve(INITIAL_STATE),
    initialData: INITIAL_STATE,
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useSendMessageMutation = () => {
  const connection = useChatConnection();

  return useMutation({
    mutationFn: (message: string) => {
      const success = connection?.send(message) ?? false;
      if (success) return Promise.resolve({ success: true });
      return Promise.reject(new Error(ERRORS.NOT_CONNECTED));
    },
  });
};

export const useDisconnectSocket = () => {
  const connection = useChatConnection();

  return () => {
    connectionState.setIsManuallyDisconnected(true);
    connectionState.setReconnectMode(RECONNECT_MODE.MANUAL);
    connection?.disconnect();
  };
};

export const useReconnectSocket = () => {
  const connection = useChatConnection();

  return () => {
    connectionState.setReconnectMode(RECONNECT_MODE.AUTO);
    connection?.connect(true);
  };
};