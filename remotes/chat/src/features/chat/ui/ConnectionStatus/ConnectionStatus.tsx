import { CONNECTION_STATUS, STATUS_CONFIG } from '$shared/constants';
import type { ConnectionStatus as ConnectionStatusType } from '$shared/types';
import { cssVar } from '$shared/lib';

import styles from './ConnectionStatus.module.css';

export interface ConnectionStatusProps {
  status: ConnectionStatusType;
  errorMessage?: string;
}

export const ConnectionStatus = ({ status, errorMessage }: ConnectionStatusProps) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[CONNECTION_STATUS.CONNECTING];
  const isAnimated =
    status === CONNECTION_STATUS.CONNECTING || status === CONNECTION_STATUS.RECONNECTING;

  return (
    <div
      className={`${styles.statusContainer} ${isAnimated ? styles.statusContainerAnimated : ''}`}
      style={cssVar('--status-color', config.color)}
      role="status"
      aria-live="polite"
      aria-label={`Статус соединения: ${config.text}`}
    >
      <div className={styles.statusIndicator}>
        <span className={styles.statusDot} />
      </div>
      <div className={styles.statusContent}>
        <div className={styles.statusText}>{config.text}</div>
        {errorMessage != null && errorMessage !== '' ? (
          <div className={styles.errorMessage} data-testid="status-error">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
};