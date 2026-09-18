import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
