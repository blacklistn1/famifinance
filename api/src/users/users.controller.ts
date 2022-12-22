import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class UsersController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
  }

  @Post('/')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
  }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
}
