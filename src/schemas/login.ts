import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Введите почту').trim(),
  password: z.string().min(1, 'Введите пароль').trim(),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
