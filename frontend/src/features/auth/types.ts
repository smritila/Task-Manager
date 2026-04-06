export interface AuthUser {
  id: number;
  firstName: string;
  lastName?: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateProfileValues {
  firstName?: string;
  lastName?: string | null;
  email?: string;
}
