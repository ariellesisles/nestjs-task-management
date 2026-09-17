import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksController as TasksControllerAsync } from './v2/tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { TasksService as TaskServiceAsync } from './v2/tasks.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity.js';
import { TaskRepository } from './task.repository.js';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController, TasksControllerAsync],
   providers: [
    TasksService,
    TaskServiceAsync,
    {
      provide: TaskRepository,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        return new TaskRepository(
          Task,
          dataSource.createEntityManager(),
        );
      },
    },
  ],
})
export class TasksModule {}
