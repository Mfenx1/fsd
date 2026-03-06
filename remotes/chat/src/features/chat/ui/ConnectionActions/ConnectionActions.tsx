import { Unlink2, RotateCw } from 'lucide-react';

import { CONNECTION_STATUS } from '$shared/constants';
import { useDisconnectSocket, useReconnectSocket } from '../../api/chatApi';
import type { ConnectionStatus } from '$shared/types';
import { isFakeUrl } from '$shared/lib';

import styles from './ConnectionActions.module.css';

export interface ConnectionActionsProps {
  status: ConnectionStatus;
}

export const ConnectionActions = ({ status }: ConnectionActionsProps) => {
  const onDisconnect = useDisconnectSocket();
  const onReconnect = useReconnectSocket();

  const showReconnectButton =
    status === CONNECTION_STATUS.ERROR ||
    status === CONNECTION_STATUS.FAILED ||
    status === CONNECTION_STATUS.DISCONNECTED;
  const showWhenConnected = status === CONNECTION_STATUS.CONNECTED;

  if (isFakeUrl()) {
    return null;
  }

  return (
    <div className={styles.actionsArea}>
      {showWhenConnected ? (
        <button
          type="button"
          onClick={onDisconnect}
          className={`${styles.actionButton} ${styles.disconnectButton}`}
          aria-label="Разорвать соединение"
        >
          <span className={styles.actionIcon} aria-hidden>
            <Unlink2 size={18} strokeWidth={2} />
          </span>
          <span className={styles.actionText}>Разорвать соединение</span>
        </button>
      ) : null}
      {showReconnectButton ? (
        <button
          type="button"
          onClick={onReconnect}
          className={`${styles.actionButton} ${styles.reconnectButton}`}
          aria-label="Переподключиться"
        >
          <span className={styles.actionIcon} aria-hidden>
            <RotateCw size={18} strokeWidth={2} />
          </span>
          <span className={styles.actionText}>Переподключиться</span>
        </button>
      ) : null}
    </div>
  );
};