import { apiRequest } from '@/lib/api';
import type {
  AuthResponse,
  LoginFormValues,
  RegisterFormValues,
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
