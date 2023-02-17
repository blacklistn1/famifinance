import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAccessGuard } from '../auth/strategies';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(JwtAccessGuard)
  @Get('/:id')
  async getProfile(@Param('id') id: number) {
    return await this.profileService.getProfile(id);
  }
}
