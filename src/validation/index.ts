import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
  email: z.string().email({ message: 'Введите корректный email' }),
  phone: z.string().regex(/^(\+7|7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, {
    message: 'Введите корректный телефонный номер',
  }),
  role: z.enum(['Admin', 'User', 'Manager'] as const),
});

export type UserFormValues = z.infer<typeof userSchema>;
