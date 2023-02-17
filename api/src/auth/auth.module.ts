import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import {
  JwtAccessGuard,
  JwtAccessStrategy,
  JwtRefreshGuard,
  JwtRefreshStrategy,
} from './strategies';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
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
