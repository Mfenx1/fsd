export const toNumber = (value: unknown): number => {
  const num = Number(value);

  return Number.isFinite(num) ? num : NaN;
};

export const toOptionalNumber = (value: unknown): number | undefined => {
  const num = Number(value);

  return Number.isFinite(num) ? num : undefined;
};

export const toOptionalString = (value: unknown): string | undefined =>
  value != null ? String(value) : undefined;

export const toRequiredString = (value: unknown, fallback: string): string =>
  (value != null ? String(value).trim() : '') || fallback;

export const parsePriceInput = (value: string): string =>
  value
    .replace(/[^\d.,]/g, '')
    .replace(/,/g, '.')
    .split('.')
    .slice(0, 2)
    .join('.');