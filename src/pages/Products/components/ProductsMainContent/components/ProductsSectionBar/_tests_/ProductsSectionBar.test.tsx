import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductsSectionBar } from '../ProductsSectionBar';

describe('ProductsSectionBar', () => {
  it('заголовок и кнопки', () => {
    render(<ProductsSectionBar onAddClick={vi.fn()} />);
    expect(screen.getByText('Все позиции')).toBeInTheDocument();
    expect(screen.getByLabelText('Обновить')).toBeInTheDocument();
    expect(screen.getByLabelText('Фильтр')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Добавить/ })).toBeInTheDocument();
  });

  it('onAddClick по кнопке Добавить', async () => {
    const onAddClick = vi.fn();
    render(<ProductsSectionBar onAddClick={onAddClick} />);
    await userEvent.click(screen.getByRole('button', { name: /Добавить/ }));
    expect(onAddClick).toHaveBeenCalledTimes(1);
  });
});
