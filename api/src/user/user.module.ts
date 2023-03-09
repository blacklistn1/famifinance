import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User, Transaction, Profile } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Transaction, Profile])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
