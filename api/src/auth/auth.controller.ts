import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalGuard } from './strategies/local/local.guard';
import { AuthService } from './auth.service';
import { JwtGuard } from './strategies/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('/')
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtGuard)
  @Get('/whoami')
  whoAmI(@Request() req: any) {
    return req.user;
  }

  @Delete('/logout')
  logout(@Request() req: any) {
    req.logout();
  }
}
