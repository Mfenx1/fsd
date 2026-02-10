import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductsToast } from '../ProductsToast';
import { useProductsUIStore } from '$store';
import type { ProductsUISlice } from '$store';

const mockSetToast = vi.fn();
const mockState = (overrides: Partial<ProductsUISlice> = {}) =>
  ({
    toast: null,
    setToast: mockSetToast,
    search: '',
    editing: null,
    addingNew: false,
    setSearch: vi.fn(),
    setEditing: vi.fn(),
    setAddingNew: vi.fn(),
    ...overrides,
  }) as ProductsUISlice;

vi.mock('$store', () => ({
  useProductsUIStore: vi.fn((selector: (s: ProductsUISlice) => unknown) =>
    selector(mockState())
  ),
}));

describe('ProductsToast', () => {
  beforeEach(() => {
    vi.mocked(useProductsUIStore).mockImplementation(
      (selector: (s: ProductsUISlice) => unknown) => selector(mockState())
    );
  });

  it('ничего не рендерит без тоста', () => {
    const { container } = render(<ProductsToast />);
    expect(container.firstChild).toBeNull();
  });

  it('показывает тост при наличии', () => {
    vi.mocked(useProductsUIStore).mockImplementation(
      (selector: (s: ProductsUISlice) => unknown) =>
        selector(mockState({ toast: { message: 'Product added' } }))
    );

    render(<ProductsToast />);
    expect(screen.getByText('Product added')).toBeInTheDocument();
  });
});
