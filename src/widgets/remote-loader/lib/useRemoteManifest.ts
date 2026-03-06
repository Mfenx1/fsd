'use client';

import { useEffect, useState } from 'react';
import { getEnv } from '$shared';
import type { RemoteManifest } from './contract';
import { getRemoteManifestUrl, type RemoteName } from '../config';

export interface UseRemoteManifestResult {
  manifest: RemoteManifest | null;
  version: string | undefined;
  loading: boolean;
}


export const useRemoteManifest = (
  name: RemoteName,
  options?: { enabled?: boolean }
): UseRemoteManifestResult => {
  const enabled = options?.enabled ?? true;
  const [state, setState] = useState<{
    manifest: RemoteManifest | null;
    version: string | undefined;
    loading: boolean;
  }>({ manifest: null, version: undefined, loading: true });

  useEffect(() => {
    if (!enabled) {
      setState({ manifest: null, version: undefined, loading: false });
      return;
    }

    const env = getEnv();
    const manifestUrl = getRemoteManifestUrl(name, env, true);

    if (!manifestUrl) {
      setState({ manifest: null, version: undefined, loading: false });
      return;
    }

    fetch(manifestUrl, { credentials: 'omit' })
      .then((r) => (r.ok ? r.json() : null))
      .then((manifest: RemoteManifest | null) => ({
        manifest,
        version: manifest?.version,
      }))
      .catch(() => ({ manifest: null, version: undefined }))
      .then(({ manifest, version }) => {
        setState({ manifest, version, loading: false });
      });
  }, [name, enabled]);

  return state;
};