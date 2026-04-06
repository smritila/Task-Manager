import { apiRequest } from '@/lib/api';
import type {
  AuthResponse,
  LoginFormValues,
  RegisterFormValues,
  AuthUser,
  UpdateProfileValues,
} from './types';

export function login(payload: LoginFormValues) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function register(payload: RegisterFormValues) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: {
      ...payload,
      lastName: payload.lastName.trim() || undefined,
    },
  });
}

export function getCurrentUser() {
  return apiRequest<{ user: AuthUser }>('/auth/me');
}

export function updateCurrentUser(payload: UpdateProfileValues) {
  return apiRequest<{ user: AuthUser }>('/auth/me', {
    method: 'PATCH',
    body: payload,
  });
}
