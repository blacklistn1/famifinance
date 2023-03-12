import { Module } from '@nestjs/common';
import { GoogleOAuthService } from '../services/google.service';
import { GoogleOAuthGuard } from '../guards';
import { UserModule } from '../../user';

@Module({
  imports: [UserModule],
  providers: [GoogleOAuthService, GoogleOAuthGuard],
  exports: [GoogleOAuthService, GoogleOAuthGuard],
})
export class SocialModule {}
