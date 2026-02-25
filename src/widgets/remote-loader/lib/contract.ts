import type { QueryClient } from '@tanstack/react-query';

export interface RemoteMountProps {
    queryClient?: QueryClient;
    locale?: string;
    theme?: string;
    initialData?: { products: unknown[]; total: number; skip: number; limit: number };
    searchParams?: { q?: string; sortBy?: string; order?: 'asc' | 'desc' };
  [key: string]: unknown;
}

export interface RemoteMountContract {
    mount: (container: HTMLElement, props?: RemoteMountProps) => void;
    unmount?: (container: HTMLElement) => void;
    version?: string;
}

export interface RemoteManifest {
  name?: string;
  label?: string;
  script?: string;
  integrity?: string;
  version?: string;
}

declare global {
  interface Window {
    __REMOTES__?: Record<string, RemoteMountContract>;
  }
}

export {};