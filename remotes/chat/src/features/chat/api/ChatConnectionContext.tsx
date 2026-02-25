'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { CONNECTION_STATUS, ERRORS, RECONNECT_MODE, WS_CONFIG } from '$shared/constants';
import type { MessagesCacheState } from '$shared/types';
import { getWsUrl } from '$shared/lib';

import { connectionState } from './connectionState';
import { createChatWebSocketConnection } from './wsConnection';
import type { ChatWebSocketConnectionApi } from './wsConnection';

import { INITIAL_STATE, QUERY_KEY_MESSAGES } from './chatApiConstants';

const ChatConnectionContext = createContext<ChatWebSocketConnectionApi | null>(
  null
);

export interface ChatConnectionProviderProps {
  children: ReactNode;
}

export const ChatConnectionProvider = ({ children }: ChatConnectionProviderProps) => {
  const queryClient = useQueryClient();

  const connection = useMemo(
    () =>
      createChatWebSocketConnection(
        {
          getWsUrl,
          config: WS_CONFIG,
          connectionState,
        },
        (update) => {
          queryClient.setQueryData<MessagesCacheState>(QUERY_KEY_MESSAGES, update);
        }
      ),
    [queryClient]
  );

  useEffect(() => {
    try {
      connectionState.setReconnectMode(RECONNECT_MODE.AUTO);
      connection.connect(true);

      return () => {
        connectionState.setReconnectMode(RECONNECT_MODE.MANUAL);
        connection.disconnect();
      };
    } catch {
      queryClient.setQueryData<MessagesCacheState>(QUERY_KEY_MESSAGES, (prev) => ({
        ...INITIAL_STATE,
        ...prev,
        status: CONNECTION_STATUS.ERROR,
        errorMessage: ERRORS.INIT_CONNECTION_ERROR,
      }));
    }
  }, [queryClient, connection]);

  return (
    <ChatConnectionContext.Provider value={connection}>
      {children}
    </ChatConnectionContext.Provider>
  );
};

export const useChatConnection = (): ChatWebSocketConnectionApi | null =>
  useContext(ChatConnectionContext);