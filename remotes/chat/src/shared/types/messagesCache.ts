import type { ConnectionStatus } from './connection';
import type { Message } from './message';

export interface MessagesCacheState {
  status: ConnectionStatus;
  errorMessage?: string;
  messages: Message[];
}