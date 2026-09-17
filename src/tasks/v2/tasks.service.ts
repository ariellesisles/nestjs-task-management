import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '../task.repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task.entity.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id} not found."`);
    }

    return found;
  }




}
