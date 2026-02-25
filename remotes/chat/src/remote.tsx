
import { createRoot } from 'react-dom/client';
import { ChatApp } from './App';

declare const __REMOTE_VERSION__: string | undefined;

export interface RemoteMountProps {
  locale?: string;
  theme?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    __REMOTES_CHAT_ROOTS__?: WeakMap<HTMLElement, ReturnType<typeof createRoot>>;
    __REMOTES__?: Record<string, { mount: (c: HTMLElement, p?: RemoteMountProps) => void; unmount?: (c: HTMLElement) => void; version?: string }>;
  }
}

const VERSION = typeof __REMOTE_VERSION__ !== 'undefined' ? __REMOTE_VERSION__ : '0.0.0-dev';

const getRoots = () => {
  if (typeof window === 'undefined') return undefined;
  window.__REMOTES_CHAT_ROOTS__ ??= new WeakMap();
  return window.__REMOTES_CHAT_ROOTS__;
};

export const version = VERSION;

export const mount = (container: HTMLElement, props?: RemoteMountProps) => {
  const roots = getRoots();
  if (!roots) return;
  let root = roots.get(container);
  if (!root) {
    root = createRoot(container);
    roots.set(container, root);
  }
  root.render(
    <ChatApp queryClient={props?.queryClient as import('@tanstack/react-query').QueryClient} />
  );
};

export const unmount = (container: HTMLElement) => {
  const roots = getRoots();
  if (!roots) return;
  const root = roots.get(container);
  if (root) {
    root.unmount();
    roots.delete(container);
  }
};

if (typeof window !== 'undefined') {
  window.__REMOTES__ = window.__REMOTES__ ?? {};
  window.__REMOTES__.chat = { version, mount, unmount };
}