import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { getUniqueViolationConstraint } from '../common/database/database-error.util.js';

import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    try {
      await this.usersRepository.createUser(dto);
    } catch (error) {
      const constraint = getUniqueViolationConstraint(error);

      switch (constraint) {
        case 'UQ_users_username':
          throw new ConflictException('Username already exists');

        default:
          throw error;
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return 'success';
  }
}
