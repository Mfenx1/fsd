import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render } from '@testing-library/react';
import type { ReactElement } from 'react';

import type { MessagesCacheState, Message } from '$shared';
import { toBranded } from '$shared';

export { screen, waitFor, within } from '@testing-library/react';
export { cleanup };

export const defaultQueryData: MessagesCacheState = {
  status: 'connecting',
  messages: [],
};

export const createQueryData = (overrides: Partial<MessagesCacheState> = {}): MessagesCacheState =>
  ({ ...defaultQueryData, ...overrides });

export const createMockMessage = (text: string, sender: 'me' | 'server'): Message => ({
  id: toBranded<'MessageId'>()(1),
  text,
  sender,
  time: '12:00',
});

export const createUseMessagesQueryResult = (data: MessagesCacheState) => ({
  data,
  isLoading: false,
  isError: false,
  isSuccess: true,
  isFetching: false,
  status: 'success' as const,
  error: null,
  refetch: () => Promise.resolve(),
});

export const renderWithQueryClient = (ui: ReactElement, options?: { queryClient?: QueryClient }) => {
  const { queryClient = new QueryClient(), ...renderOptions } = options ?? {};

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>,
      renderOptions
    ),
    queryClient,
  };
};