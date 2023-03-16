import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { GoogleOAuthGuard } from '../../auth';
import { RequestWithUser } from '../../common/types';
import { AddBalanceDto } from '../dtos/add-balance.dto';
import { ProfileDto } from '../dtos/profile.dto';

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

  @Patch('')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() payload: ProfileDto,
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
