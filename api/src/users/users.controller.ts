import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class UsersController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.signup(body.email, body.password);
  }

  @Post('/')
  async signIn(@Body() body: CreateUserDto) {
    return await this.authService.signIn(body.email, body.password);
  }
}
