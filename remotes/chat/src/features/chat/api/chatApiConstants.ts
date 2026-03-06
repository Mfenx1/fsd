import { CONNECTION_STATUS } from '$shared/constants';
import type { MessagesCacheState } from '$shared/types';

export const QUERY_KEY_MESSAGES = ['chat', 'messages'] as const;

export const INITIAL_STATE: MessagesCacheState = {
  status: CONNECTION_STATUS.CONNECTING,
  errorMessage: undefined,
  messages: [],
};