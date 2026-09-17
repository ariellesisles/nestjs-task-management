import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { Task } from '../task.entity.js';
import { CreateTaskDto } from '../dto/create-task.dto.js';
import { TaskStatus } from '../task-status.enum.js';

@Controller({ path: 'tasks', version: '2' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

   @Patch('/:id/status')
   updateTask(@Param('id') id: string, @Body('status') status: TaskStatus) {
     return this.tasksService.updateTask(id, status);
   }

  @Get()
  getTasks(): Promise<Task[]> {
    return this.tasksService.getTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Promise<Task> | undefined {
    return this.tasksService.getTaskById(id);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
