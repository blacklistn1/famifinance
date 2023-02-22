import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { Transaction } from '../entities';
import { Profile } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction, Profile])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
