import { EMPTY_CELL } from '../config';

export const formatCellValue = (value: unknown, key: string): string => {
  if (value === null || value === undefined) return EMPTY_CELL;
  if (key === 'price') {
    const num = Number(value);

    return Number.isFinite(num)
      ? num.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : EMPTY_CELL;
  }
  if (key === 'rating') {
    const num = Number(value);

    return Number.isFinite(num) ? `${num.toFixed(1)}/5` : EMPTY_CELL;
  }
  if (key === 'stock') {
    const num = Number(value);

    return Number.isFinite(num) ? String(Math.round(num)) : EMPTY_CELL;
  }
  const str = String(value).trim();

  return str === '' ? EMPTY_CELL : str;
};