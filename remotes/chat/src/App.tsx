import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Chat } from '$features';
import { createQueryClient } from '$features/chat/lib/queryClient';

export interface ChatAppProps {
    queryClient?: QueryClient;
}

export const ChatApp = ({ queryClient: hostQueryClient }: ChatAppProps) => {
  const [ownQueryClient] = useState(createQueryClient);
  const queryClient = useMemo(
    () => hostQueryClient ?? ownQueryClient,
    [hostQueryClient, ownQueryClient]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Chat />
    </QueryClientProvider>
  );
};