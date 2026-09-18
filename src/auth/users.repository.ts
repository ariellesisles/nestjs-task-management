import { Repository } from 'typeorm';
import { User } from './user.entity.js';

export class UsersRepository extends Repository<User> {}
