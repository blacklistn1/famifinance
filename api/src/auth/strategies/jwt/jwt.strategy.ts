import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const { userId, email } = payload;
    const user = await this.usersService.findOneByEmail(email);
    return { userId, email, user };
  }
}
