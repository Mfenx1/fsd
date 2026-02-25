import { useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { CONNECTION_STATUS, SEND_ERROR_MESSAGE } from '$shared/constants';
import { QUERY_KEY_MESSAGES, useMessagesQuery, useSendMessageMutation } from '../api/chatApi';
import type { ConnectionStatus, MessagesCacheState } from '$shared/types';
import { createMessage } from '$shared/lib';

export const useChat = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useMessagesQuery();
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessageMutation();
  const [sendError, setSendError] = useState<string | null>(null);

  const messages = data?.messages ?? [];
  const errorMessage = data?.errorMessage;
  const status: ConnectionStatus = data?.status ?? CONNECTION_STATUS.CONNECTING;
  const isInputDisabled = status !== CONNECTION_STATUS.CONNECTED;

  const handleSendMessage = useCallback(
    (text: string) => {
      setSendError(null);
      const addedMessage = createMessage(text, 'me');
      queryClient.setQueryData<MessagesCacheState>(QUERY_KEY_MESSAGES, (prev) => {
        const base = prev ?? { status: CONNECTION_STATUS.CONNECTING, messages: [] };
        return { ...base, messages: [...(base.messages ?? []), addedMessage] };
      });
      sendMessage(text).catch(() => {
        setSendError(SEND_ERROR_MESSAGE);
        queryClient.setQueryData<MessagesCacheState>(QUERY_KEY_MESSAGES, (prev) => {
          const base = prev ?? { status: CONNECTION_STATUS.CONNECTING, messages: [] };
          const list = base.messages ?? [];
          const idx = list.findIndex((m) => m.id === addedMessage.id);
          if (idx === -1) return prev;
          const next = [...list];
          next.splice(idx, 1);
          return { ...base, messages: next };
        });
      });
    },
    [queryClient, sendMessage]
  );

  return {
    messages,
    status,
    errorMessage,
    isInputDisabled,
    handleSendMessage,
    isLoading,
    isError,
    isSending,
    sendError,
  };
};