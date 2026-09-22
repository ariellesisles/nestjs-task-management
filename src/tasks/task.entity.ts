import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column()
  userId: string;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @JoinColumn({ name: 'userId' })
  @Exclude({ toPlainOnly: true }) // Dont show to JSON responses
  user: User;
}
