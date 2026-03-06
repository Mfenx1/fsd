import { ChatConnectionProvider } from '../api/ChatConnectionContext';
import { ChatErrorState } from './ChatErrorState';
import { ChatSkeleton } from './ChatSkeleton';
import { ConnectionActions } from './ConnectionActions';
import { ConnectionStatus } from './ConnectionStatus';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { UrlSwitch } from './UrlSwitch';
import { useChat, useMessageCountSync } from '../model';

import styles from './Chat.module.css';

const ChatContent = () => {
  useMessageCountSync();

  const {
    messages,
    status,
    errorMessage,
    isInputDisabled,
    handleSendMessage,
    isLoading,
    isError,
    isSending,
    sendError,
  } = useChat();

  if (isLoading) return <ChatSkeleton />;
  if (isError) return <ChatErrorState />;

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.switchArea}>
          <UrlSwitch />
        </div>
        <div className={styles.statusArea}>
          <ConnectionStatus status={status} errorMessage={errorMessage} />
        </div>
        <ConnectionActions status={status} />
      </div>
      <div className={styles.messagesWrapper}>
        <MessageList messages={messages} />
      </div>
      <div className={styles.inputWrapper}>
        <MessageInput
          onSend={handleSendMessage}
          disabled={isInputDisabled}
          isSending={isSending}
          sendError={sendError}
        />
      </div>
    </div>
  );
};

export const Chat = () => (
  <ChatConnectionProvider>
    <ChatContent />
  </ChatConnectionProvider>
);