import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { GoogleOAuthGuard } from '../../auth';
import { RequestWithUser } from '../../common/types';
import { ProfileDto } from '../dtos/profile.dto';
import { UpdateProfileDto } from '../dtos';

@Controller('profile')
@UseGuards(GoogleOAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/')
  getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user.id);
  }

  @Patch('')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() payload: UpdateProfileDto,
  ) {
    try {
      const res = await this.profileService.updateProfile(req.user.id, payload);
      console.log(res);
      return res;
    } catch (e) {
      return e;
    }
  }
}
