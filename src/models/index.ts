export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User' | 'Manager';
};

export type NewUser = Omit<User, 'id'>;
