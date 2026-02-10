import { api } from '$api';
import { err, get, ok, post, toApiError, type ApiError, type ApiResult } from '$lib';
import type { AuthUser, LoginPayload, LoginResponse } from '$types';

export const login = async (payload: LoginPayload): Promise<ApiResult<LoginResponse, ApiError>> => {
  try {
    const data = await post<LoginResponse & { message?: string }>(api.login(), {
      username: payload.username,
      password: payload.password,
      expiresInMins: 30,
    });

    return ok(data);
  } catch (error) {
    return err(toApiError(error));
  }
};

export const fetchMe = async (
  token: string
): Promise<ApiResult<AuthUser, ApiError>> => {
  try {
    const data = await get<AuthUser>(api.me(), { token });

    return ok(data);
  } catch (error) {
    return err(toApiError(error));
  }
};
