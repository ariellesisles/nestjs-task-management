import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
   @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject standard TypeORM repository
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<User> {
    const { sub } = jwtPayload;

    const user = await this.userRepository.findOne({ where: { id: sub } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
