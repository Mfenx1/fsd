import { memo, useEffect, useRef } from 'react';

import type { Message } from '$shared/types';

import styles from './MessageList.module.css';

export interface MessageListProps {
  messages?: Message[];
}

const MessageListItem = memo(({ msg }: { msg: Message }) => {
  const isOwn = msg.sender === 'me';
  const messageClassName = isOwn
    ? `${styles.messageItem} ${styles.messageItemOwn}`.trim()
    : styles.messageItem;
  const authorLabel = isOwn ? 'Вы' : 'Сервер';

  return (
    <div className={messageClassName}>
      <div className={styles.messageAuthor}>{authorLabel}</div>
      <div className={styles.messageText}>{msg.text}</div>
      <div className={styles.messageTimestamp}>{msg.time}</div>
    </div>
  );
});

MessageListItem.displayName = 'MessageListItem';

export const MessageList = ({ messages = [] }: MessageListProps) => {
  const isEmpty = messages.length === 0;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isEmpty) {
    return (
      <div className={styles.emptyState} role="log" aria-live="polite" aria-label="Сообщения чата">
        Сообщений пока нет
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={styles.messagesContainer}
      role="log"
      aria-live="polite"
      aria-label="Сообщения чата"
    >
      {messages.map((msg) => (
        <MessageListItem key={msg.id} msg={msg} />
      ))}
    </div>
  );
};