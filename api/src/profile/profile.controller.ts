import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/:id')
  async getProfile(@Param('id') id: number) {
    return await this.profileService.getProfile(id);
  }
}
