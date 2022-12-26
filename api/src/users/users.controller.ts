import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { Serialize } from './interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
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

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Delete('/signout')
  signOut(@Session() session: any) {
    session = null;
  }
}
