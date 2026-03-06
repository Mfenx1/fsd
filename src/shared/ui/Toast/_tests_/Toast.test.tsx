import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('показывает сообщение', () => {
    render(<Toast message="Success message" onClose={vi.fn()} />);
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('role status для доступности', () => {
    render(<Toast message="Test" onClose={vi.fn()} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('onClose после duration', () => {
    const onClose = vi.fn();
    render(<Toast message="Test" onClose={onClose} duration={3000} />);

    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});