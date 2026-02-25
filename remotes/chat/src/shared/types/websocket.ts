export interface WebSocketCallbacks {
  onOpen: () => void;
  onMessage: (event: MessageEvent) => void;
  onError: () => void;
  onClose: () => void;
}