import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from '../task.repository';
import { Task } from '../task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../task-status.enum';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { User } from '../../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user : User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id} not found."`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user : User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto , user);
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
