import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model.js';
import { v7 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto.js';

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

  updateTask(id: string, status: TaskStatus): Task {
    const index = this.getTaskIndexById(id);

    this.tasks[index].status = status;

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
