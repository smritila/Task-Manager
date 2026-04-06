import { apiRequest } from '@/lib/api';
import type { CreateTaskValues, Task, UpdateTaskValues } from './types';

export function getTasks() {
  return apiRequest<{ tasks: Task[] }>('/tasks');
}

export function createTask(payload: CreateTaskValues) {
  return apiRequest<{ task: Task }>('/tasks', {
    method: 'POST',
    body: payload,
  });
}

export function updateTask(taskId: number, payload: UpdateTaskValues) {
  return apiRequest<{ task: Task }>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteTask(taskId: number) {
  return apiRequest<{ message: string }>(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
