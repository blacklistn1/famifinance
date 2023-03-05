import { Controller, Delete, Get, Query, Req } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Tokens } from '../common/types';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  login(@Query() query: any) {
    return this.authService.login(query.code);
  }

  @Get('user')
  getUser(@Req() req: Request) {
    const token = req.get('authorization').split(' ')[1];
    return this.authService.getUser({ access_token: token });
  }

  @Get('/refresh')
  async refreshToken(tokens: Tokens) {}

  @Delete('/logout')
  async logout(@Req() req: any) {}

  /**
   * Test protected route
   */
  protected() {
    return 1;
  }
}
