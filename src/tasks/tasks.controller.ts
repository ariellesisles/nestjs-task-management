import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import type { TaskStatus } from './task-status.enum.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto.js';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    return this.tasksService.getTasksWithFilter(filterDto);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task | undefined {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  // Create Multiple Task

  @Patch('/:id/status')
  updateTask(@Param('id') id: string, @Body('status') status: string) {
    return this.tasksService.updateTask(id, status);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): Task {
    return this.tasksService.deleteTask(id);
  }
}
