import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpDto } from './dto/signup.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfile } from './user-profile.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUserWithProfile(signUpDto: SignUpDto): Promise<User> {
    const { username, password } = signUpDto;

    //password Hash || Salt round cost factor to 10 round
    const hashedPassword = await bcrypt.hash(password, 10);

    // Uses TypeORM's clean transaction callback wrapper
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const user = transactionalEntityManager.create(User, {
        username: username,
        password: hashedPassword,
      });
      const savedUser = await transactionalEntityManager.save(user);

      const profile = transactionalEntityManager.create(UserProfile, {
        fullName: signUpDto.fullName,
        email: signUpDto.email,
        userId: savedUser.id,
      });
      await transactionalEntityManager.save(profile);

      return savedUser;
    });
  }

  /**
   *
   * @param username
   * @returns User explicitly select password (since select:false hides it by default)
   */
  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username ', { username })
      .getOne();
  }
}
