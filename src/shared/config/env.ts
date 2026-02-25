
import { z } from 'zod';

const defaultApiBase = 'https://dummyjson.com';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE: z
    .string()
    .optional()
    .transform((s) => (s?.trim() || undefined) ?? defaultApiBase)
    .refine((s) => s.length > 0, 'NEXT_PUBLIC_API_BASE не может быть пустым')
    .refine(
      (s) => {
        try {
          new URL(s);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'NEXT_PUBLIC_API_BASE должен быть валидным URL' }
    ),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .optional()
    .transform((s) => (s?.trim() || undefined)),
  
  NEXT_PUBLIC_PRODUCTS_REMOTE_URL: z
    .string()
    .optional()
    .transform((s) => (s?.trim() || undefined)),
  
  NEXT_PUBLIC_PRODUCTS_REMOTE_INTEGRITY: z
    .string()
    .optional()
    .transform((s) => (s?.trim() || undefined)),
  
  NEXT_PUBLIC_CHAT_REMOTE_URL: z
    .string()
    .optional()
    .transform((s) => (s?.trim() || undefined)),
  
  NEXT_PUBLIC_CHAT_REMOTE_INTEGRITY: z
    .string()
    .optional()
    .transform((s) => (s?.trim() || undefined)),
  
  NEXT_PUBLIC_APP_VERSION: z
    .string()
    .optional()
    .transform((s) => (s?.trim() || undefined)),
});

export type Env = z.infer<typeof envSchema>;

type EnvInput = Record<string, unknown>;

const parseEnv = (input: EnvInput = process.env) => {
  const raw = {
    NEXT_PUBLIC_API_BASE: (input.NEXT_PUBLIC_API_BASE as string) ?? '',
    NEXT_PUBLIC_APP_URL: (input.NEXT_PUBLIC_APP_URL as string) ?? undefined,
    NEXT_PUBLIC_PRODUCTS_REMOTE_URL: (input.NEXT_PUBLIC_PRODUCTS_REMOTE_URL as string) ?? undefined,
    NEXT_PUBLIC_PRODUCTS_REMOTE_INTEGRITY: (input.NEXT_PUBLIC_PRODUCTS_REMOTE_INTEGRITY as string) ?? undefined,
    NEXT_PUBLIC_CHAT_REMOTE_URL: (input.NEXT_PUBLIC_CHAT_REMOTE_URL as string) ?? undefined,
    NEXT_PUBLIC_CHAT_REMOTE_INTEGRITY: (input.NEXT_PUBLIC_CHAT_REMOTE_INTEGRITY as string) ?? undefined,
    NEXT_PUBLIC_APP_VERSION: (input.NEXT_PUBLIC_APP_VERSION as string) ?? undefined,
  };
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    const issues = parsed.error.flatten();
    const msg = [
      'Ошибка конфигурации окружения:',
      ...(issues.formErrors?.length ? issues.formErrors : []),
      ...Object.entries(issues.fieldErrors).flatMap(([k, v]) =>
        (Array.isArray(v) ? v : [v]).map((e) => `${k}: ${e}`)
      ),
    ].filter(Boolean).join('\n');

    throw new Error(msg);
  }

  return parsed.data;
};

let cached: z.infer<typeof envSchema> | null = null;

export const getEnv = (input?: EnvInput): z.infer<typeof envSchema> => {
  if (cached) return cached;
  cached = parseEnv(input ?? (typeof process !== 'undefined' ? process.env : undefined));

  return cached;
};


export const env = getEnv();


export const validateServerEnv = (): void => {
  getEnv(process.env);
};


export const getAppBaseUrl = (): string => {
  const e = getEnv();
  if (e.NEXT_PUBLIC_APP_URL) return e.NEXT_PUBLIC_APP_URL;
  const vercel =
    typeof process !== 'undefined' && (process.env as Record<string, string | undefined>)?.VERCEL_URL;
  return vercel ? `https://${vercel}` : 'https://example.com';
};