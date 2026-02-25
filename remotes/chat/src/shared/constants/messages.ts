export const ERRORS = {
  RECONNECT_FAILED: 'Не удалось восстановить соединение',
  SERVER_CONNECTION_ERROR: 'Ошибка соединения с сервером',
  INIT_CONNECTION_ERROR: 'Ошибка инициализации соединения',
  NOT_CONNECTED: 'Соединение не установлено',
  SEND_FAILED: 'Не удалось отправить сообщение',
} as const;

export const SEND_ERROR_MESSAGE = ERRORS.SEND_FAILED;

export type ErrorKey = keyof typeof ERRORS;

export type ErrorMessage = (typeof ERRORS)[keyof typeof ERRORS];