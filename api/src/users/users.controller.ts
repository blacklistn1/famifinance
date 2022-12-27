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
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private authService: AuthService) {}

  /**
   * Sign up new user
   * @param {CreateUserDto} body
   * @param {*} session
   */
  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body);
    session.userId = user.id;
  }

  /**
   * Sign in
   * @param {CreateUserDto} body
   * @param {*} session
   */
  @Post('/')
  async signIn(@Body() body: SignInDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
  }

  /**
   * Get current user
   * @param {User} user
   */
  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  /**
   * Sign out
   * @param session
   */
  @Delete('/signout')
  signOut(@Session() session: any): void {
    session = null;
  }
}
