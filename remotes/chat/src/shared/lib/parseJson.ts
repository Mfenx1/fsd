export const parseJson = (text: string): unknown => JSON.parse(text);

export const parseJsonSafe = (text: string): unknown | null => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};