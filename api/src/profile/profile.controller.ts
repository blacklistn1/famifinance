import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { GoogleOAuthGuard } from '../auth/guards';

@Controller('profile')
@UseGuards(GoogleOAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/')
  getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user.id);
  }

  @Post('add-balance')
  addBalance(@Req() req: any, @Body() body: any) {
    return this.profileService.addBalance(req.user, body.amount);
  }
}
