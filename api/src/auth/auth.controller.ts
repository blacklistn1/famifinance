import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './strategies';
import { SignInDto } from '../common/dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/')
  async signIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/whoami')
  whoAmI(@Request() req: any) {
    return req.user;
  }

  @Delete('/logout')
  logout(@Request() req: any) {
    req.logout();
  }
}
