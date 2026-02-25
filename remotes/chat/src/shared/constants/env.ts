import { z } from 'zod';

const optionalTrimmedString = z
  .string()
  .optional()
  .transform((s) => (s?.trim() ? s : undefined));

const envSchema = z.object({
  VITE_WS_URL: optionalTrimmedString,
  VITE_WS_URL_FAKE: optionalTrimmedString,
});

const raw = {
  VITE_WS_URL: import.meta.env.VITE_WS_URL,
  VITE_WS_URL_FAKE: import.meta.env.VITE_WS_URL_FAKE,
};

const parsed = envSchema.safeParse(raw);

if (!parsed.success) {
  const msg = z.flattenError(parsed.error).fieldErrors;
  console.error('[env] Invalid env:', msg);
  throw new Error(`Invalid env: ${JSON.stringify(msg)}`);
}

export type Env = z.infer<typeof envSchema>;
export const env = parsed.data;