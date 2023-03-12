import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User, Profile, Category, Token, Scope } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Profile, Category, Token, Scope]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
