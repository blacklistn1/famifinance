import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { scryptSync, randomBytes } from 'crypto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new BadRequestException('Incorrect email or password');
    const [salt, storedPassword] = user.password.split('.');
    const encPassword = scryptSync(password, salt, 32).toString('hex');
    if (encPassword !== storedPassword)
      throw new BadRequestException('Incorrect password');
    return user;
  }

  async signUp(body: CreateUserDto) {
    const user = await this.userService.findOneByEmail(body.email);
    if (user) throw new BadRequestException('Email already exists');

    const salt = randomBytes(16).toString('hex');
    const encPassword = scryptSync(body.password, salt, 32).toString('hex');
    body.password = [salt, encPassword].join('.');
    return await this.userService.create(body);
  }
}
