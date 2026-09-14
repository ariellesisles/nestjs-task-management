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

  getTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTask(id: string): any {
    //find index
    const index = this.tasks.findIndex((task) => task.id === id);

    // if item exists in array splice
    if (index !== -1) this.tasks.splice(index, 1);
  }

  updateTask(id: string, status: TaskStatus): Task {
    // find index
    const index = this.tasks.findIndex((task) => task.id === id);

    // check index
    if (index === -1) throw new NotFoundException('Task not found');

    // update status by index
    this.tasks[index].status = status;

    // return updated array
    return this.tasks[index];
  }
}
