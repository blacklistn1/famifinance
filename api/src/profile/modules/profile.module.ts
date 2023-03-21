import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileService } from '../services/profile.service';
import { Profile, User } from '../../entities';
import { UserModule } from '../../user';
import { SocialModule } from '../../auth';
import { TransactionModule } from '../../transaction';

@Module({
  imports: [
    UserModule,
    SocialModule,
    TypeOrmModule.forFeature([Profile, User]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
