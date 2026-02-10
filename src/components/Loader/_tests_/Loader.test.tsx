import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loader } from '../Loader';

describe('Loader', () => {
  it('дефолтный размер', () => {
    render(<Loader />);
    expect(screen.getByLabelText('Загрузка')).toBeInTheDocument();
  });

  it('размер sm', () => {
    render(<Loader size="sm" />);
    expect(screen.getByLabelText('Загрузка')).toBeInTheDocument();
  });
});
