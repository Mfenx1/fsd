type Listener = (payload: unknown) => void;

const listeners = new Map<string, Set<Listener>>();

export const CHAT_EVENTS = {
  MESSAGE_COUNT: 'chat:messageCount',
} as const;

export const eventBus = {
  emit: (event: string, payload: unknown) => {
    listeners.get(event)?.forEach((fn) => fn(payload));
  },
  on: (event: string, fn: Listener) => {
    const set = listeners.get(event) ?? new Set();
    set.add(fn);
    listeners.set(event, set);
  },
  off: (event: string, fn: Listener) => {
    listeners.get(event)?.delete(fn);
  },
};