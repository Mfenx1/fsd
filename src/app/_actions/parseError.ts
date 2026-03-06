

export const parseFetchError = async (
  res: Response,
  fallback: string
): Promise<string> => {
  const body = (await res.json().catch(() => ({}))) as { message?: string };
  return body.message ?? res.statusText ?? fallback;
};

export const toActionError = (e: unknown, fallback: string): string =>
  e instanceof Error ? e.message : fallback;