export const generateTempId = (): number =>
  -(Date.now() * 1000 + Math.floor(Math.random() * 1000));

export const generateClientKey = (): string =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
