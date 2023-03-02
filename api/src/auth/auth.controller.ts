import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from '../common/dtos';
import { JwtPayload } from '../common/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/')
  async signIn(@Body() body: SignInDto) {}

  @Get('/refresh')
  async refreshToken(payload: JwtPayload) {}

  @Delete('/logout')
  async logout(@Req() req: any) {}

  /**
   * Test protected route
   */
  protected(@Req() req: any) {
    return 1;
  }
}
