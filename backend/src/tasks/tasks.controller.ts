import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import type { TaskResponse } from './tasks.service';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<{ task: TaskResponse }> {
    return {
      task: await this.tasksService.createTask(user.id, createTaskDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTasks(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ tasks: TaskResponse[] }> {
    return {
      tasks: await this.tasksService.findAllByUserId(user.id),
    };
  }
}
