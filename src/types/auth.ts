export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginVariables {
  username: string;
  password: string;
  rememberMe: boolean;
}
