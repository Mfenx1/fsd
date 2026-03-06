const WS_ERROR_CODES = {
  CLOSED: 'WebSocketClosedError',
  MANUAL_DISCONNECT: 'WebSocketManualDisconnectError',
  RECONNECT_FAILED: 'WebSocketReconnectFailedError',
} as const;

export type WsErrorCode = (typeof WS_ERROR_CODES)[keyof typeof WS_ERROR_CODES];

export interface WsError extends Error {
  readonly code: WsErrorCode;
}

const createWsError = (code: WsErrorCode, message: string): WsError => {
  const err = new Error(message) as WsError;
  Object.defineProperty(err, 'code', { value: code, writable: false });
  return err;
};


export const createWebSocketClosedError = (message = 'WebSocket closed'): WsError =>
  createWsError(WS_ERROR_CODES.CLOSED, message);


export const createWebSocketManualDisconnectError = (
  message = 'Manual disconnect'
): WsError => createWsError(WS_ERROR_CODES.MANUAL_DISCONNECT, message);


export const createWebSocketReconnectFailedError = (message: string): WsError =>
  createWsError(WS_ERROR_CODES.RECONNECT_FAILED, message);

export const isWebSocketManualDisconnectError = (err: unknown): err is WsError =>
  err instanceof Error && (err as WsError).code === WS_ERROR_CODES.MANUAL_DISCONNECT;