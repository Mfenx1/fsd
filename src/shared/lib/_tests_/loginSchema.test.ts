import { describe, it, expect } from 'vitest';
import { loginSchema } from '../loginSchema';

describe('loginSchema', () => {
  it('валидная форма проходит', () => {
    const result = loginSchema.safeParse({
      username: 'user@test.com',
      password: 'password123',
      rememberMe: true,
    });
    expect(result.success).toBe(true);
  });

  it('пустой username отклоняется', () => {
    const result = loginSchema.safeParse({
      username: '',
      password: 'password',
      rememberMe: false,
    });
    expect(result.success).toBe(false);
  });

  it('пустой password отклоняется', () => {
    const result = loginSchema.safeParse({
      username: 'user@test.com',
      password: '',
      rememberMe: false,
    });
    expect(result.success).toBe(false);
  });

  it('обрезка пробелов в username', () => {
    const result = loginSchema.safeParse({
      username: '  user@test.com  ',
      password: 'password',
      rememberMe: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe('user@test.com');
    }
  });
});