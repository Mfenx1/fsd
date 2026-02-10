import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { QueryDevtools } from './QueryDevtools';
import { queryClient } from '$lib';

export const renderApp = (root: HTMLElement | null): void => {
  if (root == null) return;
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <QueryDevtools />
      </QueryClientProvider>
    </StrictMode>
  );
};

const rootEl = document.getElementById('root');
renderApp(rootEl);
