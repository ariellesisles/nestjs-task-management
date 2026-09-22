import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,

} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  singUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @HttpCode(200)
  singIn(
    @Body() authDTO: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authDTO);
  }

  @Post('/test')
  @UseGuards(AuthGuard('jwt'))
  test(@Req() req: Request) {
    console.log(req);
  }
}
