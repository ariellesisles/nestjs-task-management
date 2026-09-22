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

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id} not found."`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    // 1. Normalize and validate status BEFORE touching the entity
    const normalizedStatus = status.toUpperCase() as TaskStatus;
    const isValidStatus = Object.values(TaskStatus).includes(normalizedStatus);

    if (!isValidStatus) {
      throw new BadRequestException(`"${status}" is not a valid task status.`);
    }

    // 2. Retrieve task and verify user ownership
    const task = await this.getTaskById(id, user);

    // 3. Update status and persist
    task.status = normalizedStatus;

    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const deleted = await this.taskRepository.deleteTask(id, user);

    if (!deleted) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
  }
}
