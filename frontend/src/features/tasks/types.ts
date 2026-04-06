export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  startDateTime: string | null;
  endDateTime: string | null;
  userId: number;
}

export interface CreateTaskValues {
  title: string;
  description?: string;
  status?: TaskStatus;
  startDateTime?: string;
  endDateTime?: string;
}

export interface UpdateTaskValues {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  startDateTime?: string | null;
  endDateTime?: string | null;
}
