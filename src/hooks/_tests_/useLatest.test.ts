import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLatest } from '../useLatest';

describe('useLatest', () => {
  it('ref с начальным значением', () => {
    const { result } = renderHook(() => useLatest(42));
    expect(result.current.current).toBe(42);
  });

  it('обновление ref при смене value', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 1 },
    });
    expect(result.current.current).toBe(1);
    rerender({ value: 2 });
    expect(result.current.current).toBe(2);
  });
});
