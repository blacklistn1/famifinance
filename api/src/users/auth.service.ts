import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { scryptSync, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new BadRequestException('Incorrect email or password');
  }

  async signup(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user) throw new BadRequestException('Email already exists');
    const salt = randomBytes(32).toString('hex');
  }
}
