import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User } from '../entities';
import { UserModule, UserService } from '../user';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Profile, User])],
  controllers: [ProfileController],
  providers: [ProfileService, UserService],
})
export class ProfileModule {}
