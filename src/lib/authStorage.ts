import { AUTH_REMEMBER_KEY } from '$constants';

const TOKEN_KEY = 'auth_token';
const SESSION_TOKEN_KEY = 'auth_session_token';
const SESSION_COOKIE_NAME = 'auth_session';

const isClient = typeof window !== 'undefined';

const getRememberMe = (): boolean =>
  Boolean(isClient && localStorage.getItem(AUTH_REMEMBER_KEY) === 'true');

const getCookie = (name: string): string | null => {
  if (!isClient) return null;
  const value = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];

  return value != null ? decodeURIComponent(value) : null;
};

const setSessionCookie = (name: string, value: string): void => {
  if (!isClient) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax${secure}`;
};

const deleteCookie = (name: string): void => {
  if (!isClient) return;
  document.cookie = `${name}=; path=/; max-age=0`;
};

const clearSessionAuth = (): void => {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  deleteCookie(SESSION_COOKIE_NAME);
};

export const getStoredToken = (): string | null => {
  if (!isClient) return null;
  if (getRememberMe()) return localStorage.getItem(TOKEN_KEY);

  const sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
  const cookieToken = getCookie(SESSION_COOKIE_NAME);

  if (!sessionToken || !cookieToken || sessionToken !== cookieToken) {
    clearSessionAuth();

    return null;
  }

  return sessionToken;
};

export const setStoredToken = (token: string, rememberMe: boolean): void => {
  if (!isClient) return;

  if (rememberMe) {
    clearSessionAuth();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_REMEMBER_KEY, 'true');
  } else {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    setSessionCookie(SESSION_COOKIE_NAME, token);
    localStorage.setItem(AUTH_REMEMBER_KEY, 'false');
  }
};

export const clearStoredToken = (): void => {
  if (!isClient) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_REMEMBER_KEY);
  clearSessionAuth();
};

export const removeTokenFromStorage = (): void => {
  if (!isClient) return;
  if (getRememberMe()) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    clearSessionAuth();
  }
};
