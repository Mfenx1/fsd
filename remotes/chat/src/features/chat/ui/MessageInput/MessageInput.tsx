import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Send } from 'lucide-react';

import styles from './MessageInput.module.css';

export interface MessageInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  isSending?: boolean;
  sendError?: string | null;
}

export const MessageInput = ({
  onSend,
  disabled,
  isSending = false,
  sendError = null,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const trimmedMessage = useMemo(() => message.trim(), [message]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = message.trim();
      if (trimmed !== '' && !disabled) {
        onSend(trimmed);
        setMessage('');
      }
    },
    [message, disabled, onSend]
  );

  return (
    <div className={styles.wrapper}>
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        aria-label="Отправка сообщения"
        noValidate
      >
        <input
          id="chat-message-input"
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Введите сообщение..."
          disabled={disabled}
          className={styles.input}
          aria-label="Сообщение"
          aria-invalid={sendError != null}
          aria-describedby={sendError ? 'chat-send-error' : undefined}
        />
        <button
          type="submit"
          disabled={disabled || !trimmedMessage || isSending}
          className={styles.button}
          aria-busy={isSending}
          aria-label={isSending ? 'Отправка…' : 'Отправить'}
        >
          <span className={styles.buttonIcon} aria-hidden>
            <Send size={20} strokeWidth={2} />
          </span>
          <span className={styles.buttonText}>{isSending ? 'Отправка…' : 'Отправить'}</span>
        </button>
      </form>
      {isSending ? (
        <p className={styles.sendStatus} role="status" aria-live="polite">
          Отправка…
        </p>
      ) : null}
      {sendError != null && sendError !== '' ? (
        <p id="chat-send-error" className={styles.sendError} role="alert" aria-live="assertive">
          {sendError}
        </p>
      ) : null}
    </div>
  );
};