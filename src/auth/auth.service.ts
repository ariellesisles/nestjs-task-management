import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SignUpDto } from './dto/signup.dto';
import { getUniqueViolationConstraint } from '../common/database/database-error.util';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(singUpDto: SignUpDto): Promise<void> {
    try {
      await this.usersRepository.createUserWithProfile(singUpDto);
    } catch (error) {
      const constraint = getUniqueViolationConstraint(error);

      switch (constraint) {
        case 'UQ_users_username':
          throw new ConflictException('Username already exists');
        case 'UQ_user_profiles_email':
          throw new ConflictException('Email already exists');
        default:
          this.logger.error('Failed to create user', error);
          throw new InternalServerErrorException('Unable to create account');
      }
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { username, password } = signInDto;
    const user =
      await this.usersRepository.findByUsernameWithPassword(username);

    const isValidPassword = await bcrypt.compare(
      password,
      user?.password ?? '',
    );

    if (!user || !isValidPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    const payload: JwtPayload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
