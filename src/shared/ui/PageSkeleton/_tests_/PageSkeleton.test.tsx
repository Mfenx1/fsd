import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageSkeleton } from '../PageSkeleton';

describe('PageSkeleton', () => {
  it('скелетон загрузки', () => {
    render(<PageSkeleton />);
    expect(screen.getByLabelText('Загрузка')).toBeInTheDocument();
  });

  it('aria-label для доступности', () => {
    render(<PageSkeleton />);
    expect(screen.getByLabelText('Загрузка')).toBeInTheDocument();
  });
});