import { AUTH_REMEMBER_KEY } from '$constants';

export const getDefaultRememberMe = (): boolean =>
  typeof window !== 'undefined' ? localStorage.getItem(AUTH_REMEMBER_KEY) === 'true' : false;
