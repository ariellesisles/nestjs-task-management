import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    // Filter by user
    query.andWhere('task.userId =:userId', { userId: user.id });

    // Status filter
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    // Search filter
    if (search?.trim()) {
      query.andWhere(
        'task.title ILIKE :search OR task.description ILIKE : search',
        { search: `%${search.trim()}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.find();
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await this.delete(id);

    return (result.affected ?? 0) > 0;
  }
}
