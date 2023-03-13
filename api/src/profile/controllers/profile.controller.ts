import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ProfileService } from '../services/profile.service';
import { GoogleOAuthGuard } from '../../auth/guards';
import { RequestWithUser } from '../../common/types';
import { AddBalanceDto } from '../dtos/add-balance.dto';

@Controller('profile')
@UseGuards(GoogleOAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/')
  getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user.id);
  }

  @Post('add-balance')
  addBalance(@Req() req: RequestWithUser, @Body() body: AddBalanceDto) {
    return this.profileService.addBalance(req.user, body);
  }
}
