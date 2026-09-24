import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpDto } from './dto/signup.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async createUser(signUpDto: SignUpDto): Promise<void> {
    const { username, password } = signUpDto;

    // Salt round cost factor to 10 round
    const saltRounds = 10;

    //password hash
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const user = this.repo.create({ username, password: hashPassword });
    await this.repo.save(user);
  }

  /**
   *
   * @param username
   * @returns User explicitly select password (since select:false hides it by default)
   */
  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username ', { username })
      .getOne();
  }
}
