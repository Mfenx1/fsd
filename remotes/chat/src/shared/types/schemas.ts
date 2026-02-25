import { z } from 'zod';
import type { Message } from './message';
import { toBranded } from './utils';

export const messageSchema = z
  .object({
    id: z.number(),
    text: z.string(),
    sender: z.enum(['me', 'server']),
    time: z.string(),
  })
  .strict();

export type MessageFromApi = z.infer<typeof messageSchema>;

const toMessageId = toBranded<'MessageId'>();

export const parseMessage = (value: unknown): Message => {
  const parsed = messageSchema.parse(value);

  return { ...parsed, id: toMessageId(parsed.id) };
};

export const safeParseMessage = (
  value: unknown
): { success: true; data: Message } | { success: false; error: z.ZodError } => {
  const result = messageSchema.safeParse(value);
  if (!result.success) return { success: false, error: result.error };

  return {
    success: true,
    data: { ...result.data, id: toMessageId(result.data.id) },
  };
};