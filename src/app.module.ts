import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TasksModule } from './tasks/tasks.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5430,
      username: 'postgres',
      password: 'password',
      database: 'task_db',
      autoLoadEntities: true,
      synchronize:true 
    }),
  ],
})
export class AppModule {}
