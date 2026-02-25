'use client';

import { getEnv } from '$shared';
import { RemoteLoader } from './RemoteLoader';
import { RemoteLoaderSkeleton } from './RemoteLoaderSkeleton';
import { RemoteMessageView } from '../RemoteMessageView';
import { useRemoteManifest, type RemoteMountProps } from '../../lib';
import {
  getRemoteUrl,
  getRemoteUrlFromImportMap,
  getRemoteIntegrity,
  REMOTES_REGISTRY,
  type RemoteName,
} from '../../config';


const withCacheBust = (url: string, version?: string): string => {
  if (!version) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${encodeURIComponent(version)}`;
};

interface RemoteFromRegistryProps {
  remoteName: RemoteName;
  
  fallback?: React.ReactNode;
  
  mountProps?: RemoteMountProps;
  
  mountTargetId?: string;
}

export const RemoteFromRegistry = ({
  remoteName,
  fallback = <RemoteLoaderSkeleton />,
  mountProps,
  mountTargetId,
}: RemoteFromRegistryProps) => {
  const env = getEnv();
  const baseUrl =
    getRemoteUrlFromImportMap(remoteName) ?? getRemoteUrl(remoteName, env, true);
  const integrity = getRemoteIntegrity(remoteName, env);
  const isProdRemote = !!baseUrl && baseUrl.startsWith('/remotes/') && baseUrl.endsWith('.js');
  const { version, loading } = useRemoteManifest(remoteName, { enabled: isProdRemote });

  const isPending = isProdRemote && loading;
  const state: 'pending' | { url: string; integrity?: string } | 'missing' =
    !baseUrl
      ? 'missing'
      : isPending
        ? 'pending'
        : { url: withCacheBust(baseUrl, version), integrity };

  if (state === 'pending') {
    return <>{fallback}</>;
  }

  if (state === 'missing') {
    const config = REMOTES_REGISTRY[remoteName];
    return (
      <RemoteMessageView
        title={`Remote «${config?.label ?? remoteName}» не настроен`}
        description={`Задайте URL в env (например http://localhost:4173/${remoteName}.js)`}
      />
    );
  }

  return (
    <RemoteLoader
      remoteUrl={state.url}
      remoteName={remoteName}
      integrity={state.integrity}
      fallback={fallback}
      mountProps={mountProps}
      mountTargetId={mountTargetId}
    />
  );
};