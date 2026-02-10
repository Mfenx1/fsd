import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultErrorFallback } from '../DefaultErrorFallback';

describe('DefaultErrorFallback', () => {
  it('показывает текст ошибки', () => {
    render(
      <DefaultErrorFallback
        error={new Error('Test error')}
        reset={vi.fn()}
      />
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('reset по кнопке «Попробовать снова»', async () => {
    const reset = vi.fn();
    render(
      <DefaultErrorFallback
        error={new Error('Fail')}
        reset={reset}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Попробовать снова' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
