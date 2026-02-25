
import { createRoot } from 'react-dom/client';
import { ChatApp } from './App';

const roots = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();
let lastContainer: HTMLElement | null = null;
let lastProps: Record<string, unknown> | undefined;

export const version = '0.0.0-dev';

export const mount = (container: HTMLElement, props?: Record<string, unknown>) => {
  lastContainer = container;
  lastProps = props;
  let root = roots.get(container);
  if (!root) {
    root = createRoot(container);
    roots.set(container, root);
  }
  root.render(<ChatApp queryClient={props?.queryClient as import('@tanstack/react-query').QueryClient} />);
};

export const unmount = (container: HTMLElement) => {
  if (lastContainer === container) lastContainer = null;
  const root = roots.get(container);
  if (root) {
    root.unmount();
    roots.delete(container);
  }
};

if (import.meta.hot) {
  import.meta.hot.accept(['./App'], () => {
    if (lastContainer) mount(lastContainer, lastProps);
  });
  import.meta.hot.accept(() => {
    if (lastContainer) mount(lastContainer, lastProps);
  });
}