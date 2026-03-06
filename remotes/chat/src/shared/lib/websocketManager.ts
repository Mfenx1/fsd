import type { WebSocketCallbacks } from '$shared/types';

interface WebSocketManager {
  connect: (url: string, callbacks: WebSocketCallbacks) => WebSocket;
  send: (message: string) => boolean;
  close: () => void;
}

const removeListeners = (ws: WebSocket, callbacks: WebSocketCallbacks): void => {
  const { onOpen, onMessage, onError, onClose } = callbacks;
  ws.removeEventListener('open', onOpen);
  ws.removeEventListener('message', onMessage);
  ws.removeEventListener('error', onError);
  ws.removeEventListener('close', onClose);
};

const createWebsocketManager = (): WebSocketManager => {
  let socket: WebSocket | null = null;
  let lastCallbacks: WebSocketCallbacks | null = null;

  const setupListeners = (ws: WebSocket, callbacks: WebSocketCallbacks): void => {
    const { onOpen, onMessage, onError, onClose } = callbacks;
    ws.addEventListener('open', onOpen);
    ws.addEventListener('message', onMessage);
    ws.addEventListener('error', onError);
    ws.addEventListener('close', onClose);
  };

  const connect = (url: string, callbacks: WebSocketCallbacks): WebSocket => {
    if (socket && lastCallbacks) {
      removeListeners(socket, lastCallbacks);
      socket.close();
      socket = null;
      lastCallbacks = null;
    }

    socket = new WebSocket(url);
    lastCallbacks = callbacks;
    setupListeners(socket, callbacks);

    return socket;
  };

  const send = (message: string): boolean => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(message);

      return true;
    }

    return false;
  };

  const close = (): void => {
    if (!socket || !lastCallbacks) {
      if (socket) socket.close();
      socket = null;
      lastCallbacks = null;

      return;
    }
    const s = socket;
    const c = lastCallbacks;
    lastCallbacks = null;
    const doCleanup = (): void => {
      removeListeners(s, c);
      socket = null;
    };
    s.addEventListener('close', doCleanup, { once: true });
    s.close();
  };

  return { connect, send, close };
};

export const websocketManager = createWebsocketManager();