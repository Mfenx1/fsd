import { env } from './env';

const DEFAULT_WS_URL = 'wss://ws.postman-echo.com/raw';
const DEFAULT_WS_URL_FAKE = 'wss://echo.websocket-stab.org';

export const WS_CONFIG = {
  URL: env.VITE_WS_URL ?? DEFAULT_WS_URL,
  URL_FAKE: env.VITE_WS_URL_FAKE ?? DEFAULT_WS_URL_FAKE,
  MAX_RECONNECT_ATTEMPTS: 3,
  INITIAL_RECONNECT_DELAY: 1000,
  MAX_RECONNECT_DELAY: 5000,
} as const;

export type WsConfig = typeof WS_CONFIG;