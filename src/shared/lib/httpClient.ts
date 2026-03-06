import type { RequestConfigWithAuth } from './types';
import { DEFAULT_TIMEOUT_MS } from '../config';

const buildHeaders = (config: RequestConfigWithAuth): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  };
  if (config.token) {
    headers.Authorization = `Bearer ${config.token}`;
  }

  return headers;
};

const parseErrorBody = async (response: Response): Promise<string> => {
  try {
    const json = (await response.json()) as { message?: string };

    return json.message ?? response.statusText ?? 'Ошибка запроса';
  } catch {
    return response.statusText ?? 'Ошибка запроса';
  }
};

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const request = async <T>(
  url: string | URL,
  config: RequestConfigWithAuth = {}
): Promise<T> => {
  const { method = 'GET', body, timeoutMs = DEFAULT_TIMEOUT_MS } = config;
  const signal = AbortSignal.timeout(timeoutMs);

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: buildHeaders(config),
      body: body != null ? JSON.stringify(body) : undefined,
      signal,
    });

    if (!response.ok) {
      const message = await parseErrorBody(response);
      throw new HttpError(message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new HttpError('Превышено время ожидания', 408);
      }
      throw new HttpError(error.message, 0);
    }
    throw new HttpError('Неизвестная ошибка', 0);
  }
};

export const get = <T>(
  url: string | URL,
  config?: Omit<RequestConfigWithAuth, 'method' | 'body'>
) => request<T>(url, { ...config, method: 'GET' });

export const post = <T>(url: string | URL, body?: unknown, config?: RequestConfigWithAuth) =>
  request<T>(url, { ...config, method: 'POST', body });

export const patch = <T>(url: string | URL, body?: unknown, config?: RequestConfigWithAuth) =>
  request<T>(url, { ...config, method: 'PATCH', body });