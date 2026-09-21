import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  singUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @HttpCode(200)
  singIn(@Body() authDTO: AuthCredentialsDto): Promise<string> {
    return this.authService.signIn(authDTO);
  }
}
