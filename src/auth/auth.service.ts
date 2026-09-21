import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async signUp(authCredentialDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialDto);
  }
}
