import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DebugJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: { message: any; }, context: ExecutionContext) {
    // Check your terminal console when making a Postman request
    console.log('--- JWT Guard Debugging ---');
    console.log('Error:', err);
    console.log('Info (Why failed):', info);
    console.log('User:', user);

    if (err || !user) {
      throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    }
    return user;
  }
}
