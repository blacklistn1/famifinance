import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User } from '../entities';
import { UsersModule, UsersService } from '../users';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Profile, User])],
  controllers: [ProfileController],
  providers: [ProfileService, UsersService],
})
export class ProfileModule {}
