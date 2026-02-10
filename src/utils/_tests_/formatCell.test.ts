import { describe, it, expect } from 'vitest';
import { formatCellValue } from '../formatCell';

describe('formatCellValue', () => {
  it('прочерк для null/undefined', () => {
    expect(formatCellValue(null, 'title')).toBe('—');
    expect(formatCellValue(undefined, 'title')).toBe('—');
  });

  it('цена с 2 знаками', () => {
    expect(formatCellValue(100, 'price')).toBe('100,00');
    expect(formatCellValue(99.5, 'price')).toBe('99,50');
  });

  it('рейтинг в формате X.X/5', () => {
    expect(formatCellValue(4.5, 'rating')).toBe('4.5/5');
  });

  it('остаток целым числом', () => {
    expect(formatCellValue(42.7, 'stock')).toBe('43');
  });

  it('строка для остальных ключей', () => {
    expect(formatCellValue('test', 'title')).toBe('test');
  });
});
