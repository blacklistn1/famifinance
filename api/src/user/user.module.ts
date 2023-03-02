import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { Transaction } from '../entities';
import { Profile } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction, Profile])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
