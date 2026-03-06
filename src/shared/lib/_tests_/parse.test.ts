import { describe, it, expect } from 'vitest';
import {
  toNumber,
  parsePriceInput,
} from '../parse';

describe('parse utils', () => {
  describe('toNumber', () => {
    it('преобразует число', () => {
      expect(toNumber(42)).toBe(42);
      expect(toNumber('42')).toBe(42);
    });

    it('NaN для неверного ввода', () => {
      expect(toNumber('abc')).toBeNaN();
    });
  });

  describe('parsePriceInput', () => {
    it('запятая в точку', () => {
      expect(parsePriceInput('1,5')).toBe('1.5');
    });

    it('убирает нечисловые символы', () => {
      expect(parsePriceInput('a1b2c')).toBe('12');
    });
  });
});