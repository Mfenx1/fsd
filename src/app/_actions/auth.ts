'use server';

import { cookies } from 'next/headers';
import { env, type ApiResult } from '$shared';
import type { LoginResponse } from '$entities/user';
import { parseFetchError, toActionError } from './parseError';

const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_MAX_AGE = 30 * 60; 
const ERROR_FALLBACK = 'Ошибка входа';

export type LoginActionResult = ApiResult<LoginResponse, string>;

export const loginAction = async (
  username: string,
  password: string,
  rememberMe: boolean
): Promise<LoginActionResult> => {
  try {
    const base = env.NEXT_PUBLIC_API_BASE;
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 30,
      }),
    });

    if (!res.ok) {
      return { ok: false, error: await parseFetchError(res, ERROR_FALLBACK) };
    }

    const data = (await res.json()) as LoginResponse;

    if (!rememberMe) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, data.accessToken, {
        path: '/',
        maxAge: SESSION_MAX_AGE,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });
    }

    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: toActionError(e, ERROR_FALLBACK) };
  }
};