import { describe, it, expect } from 'vitest';
import {
  getProductValue,
  validateProductForm,
  isSortableProductKey,
  sortProducts,
} from '../product';

describe('getProductValue', () => {
  const product = {
    id: 1,
    title: 'Test',
    brand: 'X',
    sku: '1',
    rating: 4,
    price: 10,
    stock: 5,
    category: 'A',
  };

  it('возвращает значение поля', () => {
    expect(getProductValue(product, 'title')).toBe('Test');
    expect(getProductValue(product, 'price')).toBe(10);
  });

  it('возвращает null для неверного ключа', () => {
    expect(getProductValue(product, 'invalid')).toBeNull();
  });
});

describe('validateProductForm', () => {
  it('пустой объект при валидной форме', () => {
    expect(
      validateProductForm({ title: 'A', brand: 'B', sku: '1', price: '10' })
    ).toEqual({});
  });

  it('ошибки при пустых обязательных полях', () => {
    const result = validateProductForm({ title: '', brand: '', sku: '', price: '' });
    expect(result.title).toBeDefined();
    expect(result.brand).toBeDefined();
    expect(result.sku).toBeDefined();
    expect(result.price).toBeDefined();
  });

  it('ошибка при неверной цене', () => {
    const result = validateProductForm({ title: 'A', brand: 'B', sku: '1', price: '-1' });
    expect(result.price).toBeDefined();
  });
});

describe('isSortableProductKey', () => {
  it('true для допустимых ключей', () => {
    expect(isSortableProductKey('title')).toBe(true);
    expect(isSortableProductKey('price')).toBe(true);
  });

  it('false для недопустимого ключа', () => {
    expect(isSortableProductKey('invalid')).toBe(false);
  });
});

describe('sortProducts', () => {
  const products = [
    { id: 1, title: 'B', brand: 'X', sku: '1', rating: 4, price: 10, stock: 5, category: 'A' },
    { id: 2, title: 'A', brand: 'Y', sku: '2', rating: 5, price: 20, stock: 3, category: 'B' },
  ];

  it('сортирует по ключу по возрастанию', () => {
    const sorted = sortProducts(products, 'title', 'asc');
    expect(sorted[0]?.title).toBe('A');
  });

  it('возвращает копию при неверном sortBy', () => {
    const sorted = sortProducts(products, 'invalid', 'asc');
    expect(sorted).toEqual(products);
  });
});
