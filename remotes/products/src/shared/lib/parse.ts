export const parsePriceInput = (value: string): string =>
  value
    .replace(/[^\d.,]/g, '')
    .replace(/,/g, '.')
    .split('.')
    .slice(0, 2)
    .join('.');