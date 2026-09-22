import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { getUniqueViolationConstraint } from '../common/database/database-error.util';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

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

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user =
      await this.usersRepository.findByUsernameWithPassword(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { sub: user.id, username: user.username };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid username or password');
    }
  }
}
