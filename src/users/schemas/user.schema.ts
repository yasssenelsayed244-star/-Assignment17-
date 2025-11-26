import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
