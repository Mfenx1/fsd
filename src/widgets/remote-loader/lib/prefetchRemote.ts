'use client';

import { getEnv } from '$shared';
import { exposeReactGlobals } from './hostReactGlobals';
import {
  getRemoteUrl,
  getRemoteUrlFromImportMap,
  REMOTES_REGISTRY,
  type RemoteName,
} from '../config';

const prefetched = new Set<string>();

const dynamicImport = (url: string): Promise<unknown> =>
  import(/* webpackIgnore: true */ url);

export const prefetchRemote = (name: RemoteName): void => {
  if (prefetched.has(name)) return;
  prefetched.add(name);

  if (typeof window === 'undefined') return;

  const env = getEnv();
  const url =
    getRemoteUrlFromImportMap(name) ??
    getRemoteUrl(name, env, true);
  if (!url) return;

  exposeReactGlobals();
  dynamicImport(url).catch(() => {
    prefetched.delete(name);
  });
};

export const prefetchAllRemotes = (): void => {
  (Object.keys(REMOTES_REGISTRY) as RemoteName[]).forEach(prefetchRemote);
};