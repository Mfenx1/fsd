'use client';

import dynamic from 'next/dynamic';
import { ChatLoaderSkeleton } from '$widgets';

export default dynamic(
  () =>
    import('$widgets/remote-loader').then((m) => ({
      default: m.ChatRemoteLoader,
    })),
  { loading: () => <ChatLoaderSkeleton />, ssr: false }
);