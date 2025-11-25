import type { roles } from '@/constants';

export type Role = (typeof roles)[number];

export type User = {
  id: string; // mockApi предоставляет id строкой
  name: string;
  email: string;
  phone: string;
  role: Role;
  chiefId?: string;
};

export type NewUser = Omit<User, 'id'>;
