import type { Env } from '$shared';

export interface RemoteConfig {
    remoteName: string;
    defaultDevUrl: string;
    devUrlFallbackFrom?: string;
    getUrl: (env: Env) => string | undefined;
    getIntegrity?: (env: Env) => string | undefined;
    label: string;
}

const DEFAULT_DEV_URL_PRODUCTS = 'http://localhost:5173/src/remote-dev.tsx';
const DEFAULT_DEV_URL_CHAT = 'http://localhost:5174/src/remote-dev.tsx';

export const REMOTES_REGISTRY: Record<string, RemoteConfig> = {
  products: {
    remoteName: 'products',
    defaultDevUrl: DEFAULT_DEV_URL_PRODUCTS,
    devUrlFallbackFrom: 'localhost:4173',
    getUrl: (env) => env.NEXT_PUBLIC_PRODUCTS_REMOTE_URL || undefined,
    getIntegrity: (env) => env.NEXT_PUBLIC_PRODUCTS_REMOTE_INTEGRITY || undefined,
    label: 'Products',
  },
  chat: {
    remoteName: 'chat',
    defaultDevUrl: DEFAULT_DEV_URL_CHAT,
    devUrlFallbackFrom: 'localhost:4174',
    getUrl: (env) => env.NEXT_PUBLIC_CHAT_REMOTE_URL || undefined,
    getIntegrity: (env) => env.NEXT_PUBLIC_CHAT_REMOTE_INTEGRITY || undefined,
    label: 'Chat',
  },
} as const;

export type RemoteName = keyof typeof REMOTES_REGISTRY;

const REMOTES_DEV_PORT_FROM = 5173;
const REMOTES_DEV_PORT_TO = 5182;
const PREVIEW_OFFSET = 1000; 

export const getRemotesDevOrigins = (): { http: string[]; ws: string[] } => {
  const devPorts = Array.from(
    { length: REMOTES_DEV_PORT_TO - REMOTES_DEV_PORT_FROM + 1 },
    (_, i) => REMOTES_DEV_PORT_FROM + i
  );
  const previewPorts = devPorts.map((p) => p - PREVIEW_OFFSET);
  const allPorts = [...new Set([...devPorts, ...previewPorts])];
  const http = allPorts.map((p) => `http://localhost:${p}`);
  const ws = allPorts.map((p) => `ws://localhost:${p}`);
  return { http, ws };
};

export const getRemoteUrl = (
  name: RemoteName,
  env: Env,
  isClient: boolean
): string | undefined => {
  const config = REMOTES_REGISTRY[name];
  if (!config) return undefined;

  const envUrl = config.getUrl(env);
  const fallback =
    isClient && !envUrl
      ? process.env.NODE_ENV === 'development'
        ? config.defaultDevUrl
        : `/remotes/${config.remoteName}.js`
      : undefined;
  let url = envUrl ?? fallback;

  if (
    isClient &&
    config.devUrlFallbackFrom &&
    typeof url === 'string' &&
    url.includes(config.devUrlFallbackFrom)
  ) {
    url = config.defaultDevUrl;
  }

  return url || undefined;
};

export const getRemoteIntegrity = (
  name: RemoteName,
  env: Env
): string | undefined => REMOTES_REGISTRY[name]?.getIntegrity?.(env);

export const getImportMapData = (env: Env): { imports: Record<string, string> } => {
  const isDev = process.env.NODE_ENV === 'development';

  const base = '/api/host-react';
  const imports: Record<string, string> = {
    react: `${base}/react`,
    'react-dom': `${base}/react-dom`,
    'react-dom/client': `${base}/react-dom/client`,
    'react/jsx-runtime': `${base}/react/jsx-runtime`,
    'react/jsx-dev-runtime': `${base}/react/jsx-dev-runtime`,
    '@tanstack/react-query': `${base}/@tanstack/react-query`,
  };

  for (const name of Object.keys(REMOTES_REGISTRY) as RemoteName[]) {
    const url = getRemoteUrl(name, env, isDev);
    if (typeof url === 'string' && url.length > 0) {
      imports[`remote/${name}`] = url;
    }
  }

  return { imports };
};

export const getRemoteManifestUrl = (
  name: RemoteName,
  env: Env,
  isClient: boolean
): string | undefined => {
  const scriptUrl = getRemoteUrl(name, env, isClient);
  if (!scriptUrl) return undefined;
  
  if (scriptUrl.startsWith('/remotes/') && scriptUrl.endsWith('.js')) {
    const config = REMOTES_REGISTRY[name];
    return config ? `/remotes/${config.remoteName}-manifest.json` : undefined;
  }
  try {
    const base = typeof document !== 'undefined' ? document.baseURI : 'http://localhost';
    const origin = new URL(scriptUrl, base).origin;
    return `${origin}/manifest.json`;
  } catch {
    return undefined;
  }
};

export const getRemoteUrlFromImportMap = (name: RemoteName): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const script = document.querySelector('script[type="importmap"]');
  if (!script?.textContent) return undefined;
  try {
    const data = JSON.parse(script.textContent) as { imports?: Record<string, unknown> };
    const value = data.imports?.[`remote/${name}`];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
};