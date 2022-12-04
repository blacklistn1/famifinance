import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/')
  async getAll(): Promise<User[]> {
    return await this.usersService.find();
  }

  @Post('/')
  async create(@Body() body: CreateUserDto): Promise<User> {
    return await this.usersService.create(body.email, body.password);
  }

  async findOne(email: string): Promise<User> {
    return await this.usersService.findOne(email);
  }
}
