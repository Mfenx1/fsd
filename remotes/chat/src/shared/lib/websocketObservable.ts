import { Observable } from 'rxjs';

export type WsEvent =
  | { type: 'open'; socket: WebSocket }
  | { type: 'message'; data: MessageEvent }
  | { type: 'error' }
  | { type: 'close' };


export const createWebSocketObservable = (url: string): Observable<WsEvent> =>
  new Observable<WsEvent>((subscriber) => {
    const ws = new WebSocket(url);

    const onOpen = (): void => {
      subscriber.next({ type: 'open', socket: ws });
    };

    const onMessage = (e: MessageEvent): void => {
      subscriber.next({ type: 'message', data: e });
    };

    const onError = (): void => {
      subscriber.next({ type: 'error' });
      subscriber.error(new Error('WebSocket error'));
    };

    const onClose = (): void => {
      subscriber.next({ type: 'close' });
      subscriber.error(new Error('WebSocket closed'));
    };

    ws.addEventListener('open', onOpen);
    ws.addEventListener('message', onMessage);
    ws.addEventListener('error', onError);
    ws.addEventListener('close', onClose);

    return (): void => {
      ws.removeEventListener('open', onOpen);
      ws.removeEventListener('message', onMessage);
      ws.removeEventListener('error', onError);
      ws.removeEventListener('close', onClose);
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  });