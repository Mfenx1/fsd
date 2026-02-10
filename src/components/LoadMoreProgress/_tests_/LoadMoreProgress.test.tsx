import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadMoreProgress } from '../LoadMoreProgress';

describe('LoadMoreProgress', () => {
  it('рендерит прогресс-бар', () => {
    const { container } = render(<LoadMoreProgress />);
    expect(container.querySelector('.bg-blue-600')).toBeInTheDocument();
  });
});
