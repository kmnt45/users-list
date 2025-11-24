import type { roles } from '@/constants';

export type Role = (typeof roles)[number];

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
};

export type NewUser = Omit<User, 'id'>;
