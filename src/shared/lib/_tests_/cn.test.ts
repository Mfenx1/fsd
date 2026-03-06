import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn', () => {
  it('объединяет классы', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('условные классы', () => {
    const show = true;
    const hide = false;
    expect(cn('base', hide && 'hidden', show && 'visible')).toBe('base visible');
  });

  it('игнорирует undefined и null', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });
});