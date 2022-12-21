import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { scryptSync, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new BadRequestException('Incorrect email or password');
    const [salt, inputPassword] = password.split('.');
    const encPassword = scryptSync(password, salt, 32).toString('hex');
    if (encPassword !== inputPassword)
      throw new BadRequestException('Incorrect password');
    return user;
  }

  async signUp(email: string, password: string) {
    const user = this.userService.findOneByEmail(email);
    if (Object.keys(user).length)
      throw new BadRequestException('Email already exists');

    const salt = randomBytes(16).toString('hex');
    const encPassword = scryptSync(password, salt, 32).toString('hex');
    const finalPassword = [salt, encPassword].join('.');
    return await this.userService.create(email, finalPassword);
  }
}
