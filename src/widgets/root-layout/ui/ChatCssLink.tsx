'use client';

import { useRemoteManifest } from '$widgets';

export const ChatCssLink = () => {
  const { version, loading } = useRemoteManifest('chat');

  if (loading) return null;
  const href = version
    ? `/remotes/chat.css?v=${encodeURIComponent(version)}`
    : '/remotes/chat.css';
  return <link rel="stylesheet" href={href} />;
};