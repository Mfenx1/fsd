import { describe, it, expect } from 'vitest';
import { createApiEndpoints } from '../endpoints';

describe('createApiEndpoints', () => {
  it('эндпоинты с base url', () => {
    const api = createApiEndpoints('https://api.test');
    expect(api.base).toBe('https://api.test');
  });

  it('login', () => {
    const api = createApiEndpoints('https://api.test');
    expect(api.login()).toBe('https://api.test/auth/login');
  });

  it('me', () => {
    const api = createApiEndpoints('https://api.test');
    expect(api.me()).toBe('https://api.test/auth/me');
  });
});