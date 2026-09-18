import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}
}
