import { Repository } from 'typeorm';
import { Task } from './task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { TaskStatus } from './task-status.enum.js';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto.js';

export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    console.log('status:', status);

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await this.delete(id);

    return (result.affected ?? 0) > 0;
  }
}
