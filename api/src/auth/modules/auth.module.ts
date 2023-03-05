import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { UserModule } from '../../user';
import { SocialModule } from './social.module';

@Module({
  imports: [UserModule, SocialModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
