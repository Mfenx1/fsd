import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDefaultRememberMe } from '../rememberMe';

describe('getDefaultRememberMe', () => {
  const originalLocalStorage = globalThis.localStorage;

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it('true при "true" в localStorage', () => {
    vi.mocked(globalThis.localStorage.getItem).mockReturnValue('true');
    expect(getDefaultRememberMe()).toBe(true);
  });

  it('false при "false" в localStorage', () => {
    vi.mocked(globalThis.localStorage.getItem).mockReturnValue('false');
    expect(getDefaultRememberMe()).toBe(false);
  });

  it('false при другом значении', () => {
    vi.mocked(globalThis.localStorage.getItem).mockReturnValue('other');
    expect(getDefaultRememberMe()).toBe(false);
  });

  it('false при null из localStorage', () => {
    vi.mocked(globalThis.localStorage.getItem).mockReturnValue(null);
    expect(getDefaultRememberMe()).toBe(false);
  });
});