import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Get('/')
  async getAll(): Promise<User[]> {
    return await this.usersService.find();
  }

  @Post('/')
  async signup(@Body() body: CreateUserDto): Promise<User> {
    return await this.authService.signup(body.email, body.password);
  }

  async findOne(email: string): Promise<User> {
    return await this.usersService.findOne(email);
  }
}
