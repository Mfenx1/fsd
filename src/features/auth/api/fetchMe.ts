import { api, err, get, ok, toApiError, type ApiError, type ApiResult } from '$shared';
import type { AuthUser } from '$entities/user';

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