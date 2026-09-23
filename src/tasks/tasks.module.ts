import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksController as TasksControllerAsync } from './v2/tasks.controller';
import { TasksService } from './tasks.service';
import { TasksService as TaskServiceAsync } from './v2/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { DataSource } from 'typeorm';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ConfigModule, AuthModule],
  controllers: [TasksController, TasksControllerAsync],
  providers: [
    TasksService,
    TaskServiceAsync,
    {
      provide: TaskRepository,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        return new TaskRepository(Task, dataSource.createEntityManager());
      },
    },
  ],
})
export class TasksModule {}
