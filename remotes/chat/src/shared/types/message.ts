import type { MessageId } from './utils';

export interface Message {
  id: MessageId;
  text: string;
  sender: 'me' | 'server';
  time: string;
}