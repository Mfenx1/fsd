import type { Message } from '$shared/types';
import { toBranded } from '$shared/types/utils';

const toMessageId = toBranded<'MessageId'>();

export const createMessage = (text: string, sender: Message['sender']): Message => ({
  id: toMessageId(Date.now()),
  text,
  sender,
  time: new Date().toLocaleTimeString('ru-RU'),
});