import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from '../task.repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task.entity.js';
import { CreateTaskDto } from '../dto/create-task.dto.js';
import { TaskStatus } from '../task-status.enum.js';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  getTasks(): Promise<Task[]> {
    return this.taskRepository.getTasks();
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id} not found."`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    const normalizedStatus = status.toUpperCase();

    task.status = normalizedStatus as TaskStatus;

    const isValidStatus = Object.values(TaskStatus).includes(
      normalizedStatus as TaskStatus,
    );

    if (!isValidStatus) {
      throw new BadRequestException(`"${status}" is not a valid task status.`);
    }

    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const deleted = await this.taskRepository.deleteTask(id);

    if (!deleted) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
  }
}
