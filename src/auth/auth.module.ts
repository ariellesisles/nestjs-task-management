import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository.js';
import { User } from './user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, UsersRepository],
  controllers: [AuthController],
  exports: [UsersRepository],
})
export class AuthModule {}
