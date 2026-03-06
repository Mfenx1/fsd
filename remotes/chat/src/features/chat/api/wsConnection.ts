import {
  retry,
  Subject,
  Subscription,
  takeUntil,
  tap,
  throwError,
  timer,
} from 'rxjs';

import {
  CONNECTION_STATUS,
  ERRORS,
  RECONNECT_MODE,
  WS_CONFIG,
} from '$shared/constants';
import type { ConnectionStatus, Message, MessagesCacheState } from '$shared/types';
import { safeParseMessage } from '$shared/types';
import type { Observable } from 'rxjs';
import {
  createMessage,
  createWebSocketObservable,
  parseJsonSafe,
} from '$shared/lib';
import type { WsEvent } from '$shared/lib';

import type { ConnectionStateApi } from './connectionState';
import {
  createWebSocketManualDisconnectError,
  createWebSocketReconnectFailedError,
} from './wsConnectionErrors';

export type UpdateCacheFn = (
  update: (prev: MessagesCacheState | undefined) => MessagesCacheState
) => void;

export interface CacheUpdaters {
  updateStatus: (status: ConnectionStatus, errorMessage?: string) => void;
  addMessage: (text: string, sender: 'me' | 'server') => void;
  pushMessage: (message: Message) => void;
}

export interface WsConnectionDeps {
  
  getWsUrl: () => string;
  
  config: Pick<
    typeof WS_CONFIG,
    'MAX_RECONNECT_ATTEMPTS' | 'INITIAL_RECONNECT_DELAY' | 'MAX_RECONNECT_DELAY'
  >;
  
  connectionState: ConnectionStateApi;
  
  createWebSocketObservableFn?: (url: string) => Observable<WsEvent>;
}

const getBase = (prev: MessagesCacheState | undefined): MessagesCacheState => ({
  status: prev?.status ?? CONNECTION_STATUS.CONNECTING,
  errorMessage: prev?.errorMessage,
  messages: prev?.messages ?? [],
});


export const createCacheUpdaters = (updateCache: UpdateCacheFn): CacheUpdaters => {
  const updateStatus = (
    status: ConnectionStatus,
    errorMessage?: string
  ): void => {
    updateCache((prev) => ({ ...getBase(prev), status, errorMessage }));
  };

  const addMessage = (text: string, sender: 'me' | 'server' = 'server'): void => {
    const message = createMessage(text, sender);
    updateCache((prev) => {
      const base = getBase(prev);
      return { ...base, messages: [...base.messages, message] };
    });
  };

  const pushMessage = (message: Message): void => {
    updateCache((prev) => {
      const base = getBase(prev);
      return { ...base, messages: [...base.messages, message] };
    });
  };

  return { updateStatus, addMessage, pushMessage };
};

export type OpenSocketFn = (resetAttempts?: boolean) => void;

export interface ChatWebSocketConnectionApi {
  
  connect: OpenSocketFn;
  
  disconnect: () => void;
  
  send: (message: string) => boolean;
}


export const createChatWebSocketConnection = (
  deps: WsConnectionDeps,
  updateCache: UpdateCacheFn
): ChatWebSocketConnectionApi => {
  const {
    getWsUrl,
    config,
    connectionState,
    createWebSocketObservableFn = createWebSocketObservable,
  } = deps;
  const { updateStatus, addMessage, pushMessage } = createCacheUpdaters(updateCache);

  let socket: WebSocket | null = null;
  let subscription: Subscription | null = null;
  const abort$ = new Subject<void>();

  const handleMessage = (event: MessageEvent): void => {
    const raw =
      typeof event.data === 'string'
        ? event.data
        : event.data != null
          ? String(event.data)
          : '';
    const text = typeof raw === 'string' ? raw.trim() : '';
    if (text.startsWith('{')) {
      const parsed = parseJsonSafe(raw);
      if (parsed !== null) {
        const result = safeParseMessage(parsed);
        if (result.success) {
          pushMessage(result.data);
          return;
        }
      }
    }
    addMessage(raw, 'server');
  };

  const disconnect = (): void => {
    abort$.next();
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
    if (socket) {
      socket.close();
      socket = null;
    }
    updateStatus(CONNECTION_STATUS.DISCONNECTED);
  };

  const connect = (resetAttempts?: boolean): void => {
    void resetAttempts;
    disconnect();

    updateStatus(CONNECTION_STATUS.CONNECTING);

    const stream$ = createWebSocketObservableFn(getWsUrl()).pipe(
      tap((event) => {
        switch (event.type) {
          case 'open':
            socket = event.socket;
            updateStatus(CONNECTION_STATUS.CONNECTED);
            break;
          case 'message':
            handleMessage(event.data);
            break;
          case 'error':
            updateStatus(CONNECTION_STATUS.ERROR, ERRORS.SERVER_CONNECTION_ERROR);
            break;
          case 'close':
            if (connectionState.getIsManuallyDisconnected()) {
              connectionState.setIsManuallyDisconnected(false);
            }
            updateStatus(CONNECTION_STATUS.DISCONNECTED);
            break;
        }
      }),
      retry({
        delay: (_, retryCount) => {
          if (retryCount > config.MAX_RECONNECT_ATTEMPTS) {
            updateStatus(CONNECTION_STATUS.FAILED, ERRORS.RECONNECT_FAILED);
            return throwError(
              () => createWebSocketReconnectFailedError(ERRORS.RECONNECT_FAILED)
            );
          }
          if (connectionState.getReconnectMode() === RECONNECT_MODE.MANUAL) {
            return throwError(() => createWebSocketManualDisconnectError());
          }
          const delayMs = Math.min(
            config.INITIAL_RECONNECT_DELAY * retryCount,
            config.MAX_RECONNECT_DELAY
          );
          updateStatus(CONNECTION_STATUS.RECONNECTING);
          return timer(delayMs).pipe(takeUntil(abort$));
        },
      })
    );

    subscription = stream$.subscribe({
      error: () => {
        socket = null;
      },
    });
  };

  const send = (message: string): boolean => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(message);
      return true;
    }
    return false;
  };

  return { connect, disconnect, send };
};