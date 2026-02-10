import { describe, it, expect } from 'vitest';
import { parseProduct } from '../product';

describe('parseProduct', () => {
  it('парсит валидный продукт', () => {
    const raw = {
      id: 1,
      title: 'Product',
      brand: 'Brand',
      sku: 'SKU-1',
      price: 100,
      rating: 4.5,
      category: 'Category',
    };
    const result = parseProduct(raw);
    expect(result.id).toBe(1);
    expect(result.title).toBe('Product');
    expect(result.brand).toBe('Brand');
    expect(result.sku).toBe('SKU-1');
    expect(result.price).toBe(100);
    expect(result.rating).toBe(4.5);
    expect(result.category).toBe('Category');
  });

  it('FALLBACK_PRODUCT при невалидных данных', () => {
    const result = parseProduct(null);
    expect(result.title).toBe('—');
    expect(result.brand).toBe('—');
  });
});
