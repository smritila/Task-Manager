import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

interface TaskRow {
  task_id: string;
  task_status: 'todo' | 'in_progress' | 'done';
  task_creation_date: Date;
  start_date_time: Date | null;
  end_date_time: Date | null;
  task_title: string;
  task_desc: string | null;
  created_by: string;
}

type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface TaskResponse {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  startDateTime: string | null;
  endDateTime: string | null;
  userId: number;
}

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createTask(
    userId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponse> {
    const result = await this.databaseService.query<TaskRow>(
      `INSERT INTO public.tasks (
         task_status,
         start_date_time,
         end_date_time,
         task_title,
         task_desc,
         created_by
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING task_id, task_status, task_creation_date, start_date_time, end_date_time, task_title, task_desc, created_by`,
      [
        createTaskDto.status ?? 'todo',
        createTaskDto.startDateTime ?? null,
        createTaskDto.endDateTime ?? null,
        createTaskDto.title,
        createTaskDto.description ?? null,
        userId,
      ],
    );

    return this.toTaskResponse(result.rows[0]);
  }

  async findAllByUserId(userId: number): Promise<TaskResponse[]> {
    const result = await this.databaseService.query<TaskRow>(
      `SELECT task_id, task_status, task_creation_date, start_date_time, end_date_time, task_title, task_desc, created_by
       FROM public.tasks
       WHERE created_by = $1
       ORDER BY task_creation_date DESC, task_id DESC`,
      [userId],
    );

    return result.rows.map((task) => this.toTaskResponse(task));
  }

  async updateTask(
    userId: number,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    if (
      updateTaskDto.title === undefined &&
      updateTaskDto.description === undefined &&
      updateTaskDto.status === undefined &&
      updateTaskDto.startDateTime === undefined &&
      updateTaskDto.endDateTime === undefined
    ) {
      throw new BadRequestException('Provide at least one task field to update.');
    }

    const hasTitle = updateTaskDto.title !== undefined;
    const hasDescription = updateTaskDto.description !== undefined;
    const hasStatus = updateTaskDto.status !== undefined;
    const hasStartDateTime = updateTaskDto.startDateTime !== undefined;
    const hasEndDateTime = updateTaskDto.endDateTime !== undefined;

    const result = await this.databaseService.query<TaskRow>(
      `UPDATE public.tasks
       SET task_title = CASE WHEN $3 THEN $4 ELSE task_title END,
           task_desc = CASE WHEN $5 THEN $6 ELSE task_desc END,
           task_status = CASE WHEN $7 THEN $8 ELSE task_status END,
           start_date_time = CASE WHEN $9 THEN $10 ELSE start_date_time END,
           end_date_time = CASE WHEN $11 THEN $12 ELSE end_date_time END
       WHERE task_id = $1 AND created_by = $2
       RETURNING task_id, task_status, task_creation_date, start_date_time, end_date_time, task_title, task_desc, created_by`,
      [
        taskId,
        userId,
        hasTitle,
        updateTaskDto.title,
        hasDescription,
        hasDescription ? updateTaskDto.description : null,
        hasStatus,
        updateTaskDto.status,
        hasStartDateTime,
        hasStartDateTime ? updateTaskDto.startDateTime : null,
        hasEndDateTime,
        hasEndDateTime ? updateTaskDto.endDateTime : null,
      ],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException('Task not found.');
    }

    return this.toTaskResponse(result.rows[0]);
  }

  async deleteTask(userId: number, taskId: number): Promise<void> {
    const result = await this.databaseService.query(
      `DELETE FROM public.tasks
       WHERE task_id = $1 AND created_by = $2`,
      [taskId, userId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException('Task not found.');
    }
  }

  private toTaskResponse(task: TaskRow): TaskResponse {
    return {
      id: Number(task.task_id),
      title: task.task_title,
      description: task.task_desc,
      status: task.task_status,
      createdAt: task.task_creation_date.toISOString(),
      startDateTime: task.start_date_time?.toISOString() ?? null,
      endDateTime: task.end_date_time?.toISOString() ?? null,
      userId: Number(task.created_by),
    };
  }
}
