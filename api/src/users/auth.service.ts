import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class AuthService {
  scrypt;
  constructor(private userService: UsersService) {
    this.scrypt = promisify(_scrypt);
  }

  async signup(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (user) throw new BadRequestException('email is in use');

    const salt = randomBytes(16).toString('hex');
    const hash = (await this.scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    return await this.userService.create(email, result);
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) throw new NotFoundException('User not found');
  }
}
