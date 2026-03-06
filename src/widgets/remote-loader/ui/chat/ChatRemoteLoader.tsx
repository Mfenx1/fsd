'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useResolvedTheme } from '$widgets';
import { ChatLoaderSkeleton } from './ChatLoaderSkeleton';
import { RemoteFromRegistry } from '../loader';


export const ChatRemoteLoader = () => {
  const queryClient = useQueryClient();
  const theme = useResolvedTheme();
  return (
    <RemoteFromRegistry
      remoteName="chat"
      fallback={<ChatLoaderSkeleton />}
      mountProps={{ queryClient, theme }}
    />
  );
};