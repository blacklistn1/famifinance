import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { LogoutQuery } from '../../common/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('token')
  login(@Body() body: any) {
    return this.authService.login(body.code);
  }

  @Get('userinfo')
  getUser(@Req() req: Request) {
    const token = req.get('authorization').split(' ')[1];
    return this.authService.getUser({ access_token: token });
  }

  @Get('refresh')
  refreshToken() {
    this.authService.refreshToken();
  }

  @Get('logout')
  @Redirect('', 302)
  async logout(@Query() query: LogoutQuery) {
    await this.authService.logout();
    return {
      url: query.logout_uri,
    };
  }
}
