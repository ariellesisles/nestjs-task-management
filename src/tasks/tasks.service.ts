import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum.js';
import { v7 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto.js';
import { Task } from './task.interface.js';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    //define temporary array to hold result

    let tasks = this.tasks;

    // filter with status
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    // filter with search
    if (search) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    //return final result
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);

    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id} not found."`);
    }

    return task;
  }

  deleteTask(id: string): any {
    const index = this.getTaskIndexById(id);
    this.tasks.splice(index, 1);
  }

  updateTask(id: string, status: string): Task {
    const normalizedStatus = status.toUpperCase();

    const index = this.getTaskIndexById(id);

    const isValidStatus = Object.values(TaskStatus).includes(
      normalizedStatus as TaskStatus,
    );

    if (!isValidStatus) {
      throw new BadRequestException(`"${status}" is not a valid task status.`);
    }

    this.tasks[index].status = status as TaskStatus;

    return this.tasks[index];
  }

  getTaskIndexById(id: String) {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return index;
  }
}
