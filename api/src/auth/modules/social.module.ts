import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleOAuthService } from '../services/google.service';

@Module({
  imports: [ConfigModule],
  providers: [GoogleOAuthService],
  exports: [GoogleOAuthService],
})
export class SocialModule {}
