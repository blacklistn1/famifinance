import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './strategies';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/')
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
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
