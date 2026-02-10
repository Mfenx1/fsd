import { describe, it, expect } from 'vitest';
import { generateTempId, generateClientKey } from '../id';

describe('generateTempId', () => {
  it('возвращает отрицательное число', () => {
    expect(generateTempId()).toBeLessThan(0);
  });
});

describe('generateClientKey', () => {
  it('возвращает строку', () => {
    expect(typeof generateClientKey()).toBe('string');
  });

  it('уникальные значения', () => {
    const a = generateClientKey();
    const b = generateClientKey();
    expect(a).not.toBe(b);
  });
});
