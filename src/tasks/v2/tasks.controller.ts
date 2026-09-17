import {
  Controller,
  Get,
  Param,

} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { Task } from '../task.entity.js';

@Controller({ path: 'tasks', version: '2' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}


  @Get(':id')
  getTaskById(@Param('id') id: string): Promise<Task> | undefined {
    return this.tasksService.getTaskById(id);
  }

}
