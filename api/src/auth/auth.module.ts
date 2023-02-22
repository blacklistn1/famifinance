import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users';
import { JwtModule as TokenModule } from '../jwt';
import {
  JwtAccessGuard,
  JwtAccessStrategy,
  JwtRefreshGuard,
  JwtRefreshStrategy,
} from './strategies';

@Module({
  imports: [UsersModule, TokenModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtAccessGuard,
    JwtRefreshStrategy,
    JwtRefreshGuard,
  ],
})
export class AuthModule {}
