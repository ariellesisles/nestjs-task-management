import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async createUser(authCredentialDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialDto;

    // salt
    const salt = await bcrypt.genSalt();

    //password hash
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.repo.create({ username, password: hashPassword });
    await this.repo.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }
}
