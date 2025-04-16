
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string | null;
}

export interface UserCreateInput {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'operator';
}

export interface UserUpdateInput {
  name?: string;
  role?: 'admin' | 'operator';
  password?: string;
}
