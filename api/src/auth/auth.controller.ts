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
import { JwtRefreshGuard } from './strategies';
import { SignInDto, SignUpDto } from '../common/dtos';
import { JwtPayload, Tokens } from '../common/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/')
  async signIn(@Body() body: SignInDto): Promise<Tokens> {
    return await this.authService.signIn(body);
  }

  @Post('/signup')
  async signUp(@Body() body: SignUpDto): Promise<Tokens> {
    return await this.authService.signUp(body);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refreshToken(payload: JwtPayload): Promise<Tokens> {
    return await this.authService.refreshToken(payload);
  }

  @UseGuards(JwtRefreshGuard)
  @Delete('/logout')
  async logout(@Request() req: any) {
    return await this.authService.signOut(req.user);
  }
}
