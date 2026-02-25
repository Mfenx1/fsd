
const DEFAULT_API_BASE = 'https://dummyjson.com';

const getApiBase = (): string => {
  if (typeof window !== 'undefined' && (window as unknown as { __API_BASE__?: string }).__API_BASE__) {
    return (window as unknown as { __API_BASE__: string }).__API_BASE__;
  }

  const fromEnv = (import.meta as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE?.trim();

  if (fromEnv) return fromEnv;

  return DEFAULT_API_BASE;
};

export const getApiBaseUrl = getApiBase;
export const DEFAULT_TIMEOUT_MS = 15_000;