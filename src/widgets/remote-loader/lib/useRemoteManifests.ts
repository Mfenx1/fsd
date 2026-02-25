'use client';

import { useEffect, useState } from 'react';
import { getEnv } from '$shared';
import type { RemoteManifest } from './contract';
import { getRemoteManifestUrl, REMOTES_REGISTRY, type RemoteName } from '../config';

export const useRemoteManifests = () => {
  const [manifests, setManifests] = useState<Record<RemoteName, RemoteManifest | null>>(
    {} as Record<RemoteName, RemoteManifest | null>
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const env = getEnv();
    const names = Object.keys(REMOTES_REGISTRY) as RemoteName[];
    const results = {} as Record<RemoteName, RemoteManifest | null>;

    const run = async () => {
      await Promise.all(
        names.map(async (name) => {
          const url = getRemoteManifestUrl(name, env, true);
          if (!url) {
            results[name] = null;
            return;
          }
          try {
            const res = await fetch(url, { credentials: 'omit' });
            if (!res.ok) {
              results[name] = null;
              return;
            }
            const data = (await res.json()) as RemoteManifest;
            results[name] = data;
          } catch {
            results[name] = null;
          }
        })
      );
      setManifests(results);
      setLoading(false);
    };

    run();
  }, []);

  return { manifests, loading };
};