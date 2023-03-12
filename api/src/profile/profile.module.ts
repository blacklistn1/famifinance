import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile, User } from '../entities';
import { UserModule } from '../user';
import { SocialModule } from '../auth/modules/social.module';

@Module({
  imports: [
    UserModule,
    SocialModule,
    TypeOrmModule.forFeature([Profile, User]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
