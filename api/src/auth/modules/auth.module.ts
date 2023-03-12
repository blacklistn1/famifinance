import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserModule } from '../../user';
import { SocialModule } from './social.module';

@Module({
  imports: [UserModule, SocialModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
