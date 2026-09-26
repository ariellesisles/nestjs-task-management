import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { SignUpDto, SignUpResponseDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    await this.authService.signUp(signUpDto);

    return {
      message: 'Account created successfully',
    };
  }

  @Post('/signin')
  @HttpCode(200)
  singIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    this.logger.verbose(`User ${signInDto.username} wants to signin`);
    return this.authService.signIn(signInDto);
  }
}
