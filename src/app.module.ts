import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TasksModule } from './tasks/tasks.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5440,
      username: 'postgres',
      password: 'password',
      database: 'task_db',
      autoLoadEntities: true,
      synchronize:true 
    }),
    AuthModule,
  ],
})
export class AppModule {}
