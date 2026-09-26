import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { UserProfile } from './user-profile.entity';

@Entity('user')
@Unique('UQ_users_username', ['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @Index('idx_users_username')
  username: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user, {
    eager: true,
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  tasks: Task[];

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  profile: UserProfile;
}
