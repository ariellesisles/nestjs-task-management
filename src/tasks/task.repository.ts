import { Repository } from 'typeorm';
import { Task } from './task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { TaskStatus } from './task-status.enum.js';

export class TaskRepository extends Repository<Task> {
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

  async getTasks(): Promise<Task[]> {
    return await this.find();
  }

  async deleteTask(id: string): Promise<any> {
    await this.delete(id);
  }
}
