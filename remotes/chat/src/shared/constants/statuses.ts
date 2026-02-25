export const RECONNECT_MODE = {
  AUTO: 'auto',
  MANUAL: 'manual',
} as const;

export const CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
  FAILED: 'failed',
} as const;

export type ConnectionStatusValue = (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];

export type ReconnectModeValue = (typeof RECONNECT_MODE)[keyof typeof RECONNECT_MODE];

export interface StatusConfigEntry {
  text: string;
  color: string;
}

const defineStatusConfig = <T extends Record<ConnectionStatusValue, StatusConfigEntry>>(
  obj: T
): T => obj;

export const STATUS_CONFIG = defineStatusConfig({
  [CONNECTION_STATUS.CONNECTING]: {
    text: 'Подключаемся',
    color: '#ffa500',
  },
  [CONNECTION_STATUS.CONNECTED]: {
    text: 'Подключено',
    color: '#28a745',
  },
  [CONNECTION_STATUS.DISCONNECTED]: {
    text: 'Отключено',
    color: '#6c757d',
  },
  [CONNECTION_STATUS.RECONNECTING]: {
    text: 'Переподключение...',
    color: '#ffa500',
  },
  [CONNECTION_STATUS.ERROR]: {
    text: 'Ошибка соединения',
    color: '#dc3545',
  },
  [CONNECTION_STATUS.FAILED]: {
    text: 'Не удалось подключиться',
    color: '#dc3545',
  },
});