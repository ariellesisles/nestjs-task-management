import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity.js';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async createUser(authCredentialDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialDto;
    const user = this.repo.create({ username, password });
    await this.repo.save(user);
  }
}
