import { CHAT_EVENTS, eventBus } from '$shared/lib';
import { useEffect } from 'react';

import { useMessagesQuery } from '../api/chatApi';

export const useMessageCountSync = (): void => {
  const { data } = useMessagesQuery();
  const messages = data?.messages ?? [];
  const count = messages.length;

  useEffect(() => {
    eventBus.emit(CHAT_EVENTS.MESSAGE_COUNT, {
      count,
      timestamp: Date.now(),
    });
  }, [count]);
};