import { HttpError } from './httpClient';

export interface ApiError {
  message: string;
  status?: number;
}

export type ApiResult<T, E = ApiError> = { ok: true; data: T } | { ok: false; error: E };

export const ok = <T>(data: T): ApiResult<T> => ({ ok: true, data });

export const err = <E = ApiError>(error: E): ApiResult<never, E> => ({ ok: false, error });

export const isOk = <T, E>(r: ApiResult<T, E>): r is { ok: true; data: T } => r.ok;

export const isErr = <T, E>(r: ApiResult<T, E>): r is { ok: false; error: E } => !r.ok;

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof HttpError) {
    return { message: error.message, status: error.status };
  }

  return {
    message: error instanceof Error ? error.message : 'Сетевая ошибка',
  };
};

export const throwApiError = (error: ApiError): never => {
  const e = new Error(error.message) as Error & { status?: number };
  e.status = error.status;
  throw e;
};
