import { z } from 'zod';

import { roles } from '@/constants';

export const userSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z
    .string()
    .regex(/^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, 'Введите корректный телефонный номер'),
  role: z.enum(roles),
  chiefId: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
