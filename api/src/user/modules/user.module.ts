import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User, Profile, Token, Scope } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Profile, Token, Scope])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
