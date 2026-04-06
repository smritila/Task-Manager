import axios, { type AxiosRequestConfig } from 'axios';
import { getStoredToken } from '@/features/auth/auth-storage';

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '/api';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  try {
    const token = getStoredToken();

    const config: AxiosRequestConfig = {
      url: path,
      method: options.method,
      headers: {
        ...(options.headers as AxiosRequestConfig['headers']),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      data: options.body,
      signal: options.signal ?? undefined,
    };

    const response = await apiClient.request(config);

    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorBody = error.response?.data as
        | { message?: string | string[] }
        | undefined;
      let errorMessage = 'Something went wrong. Please try again.';

      if (Array.isArray(errorBody?.message)) {
        errorMessage = errorBody.message[0] ?? errorMessage;
      } else if (errorBody?.message) {
        errorMessage = errorBody.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new ApiError(errorMessage, error.response?.status ?? 500);
    }

    throw new ApiError('Something went wrong. Please try again.', 500);
  }
}
