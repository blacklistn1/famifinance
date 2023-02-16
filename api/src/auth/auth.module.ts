import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { auth } from '../config/auth/auth.config';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { LocalGuard } from './strategies/local/local.guard';
import { LocalStrategy } from './strategies/local/local.strategy';
import { JwtAccessStrategy } from './strategies/jwt/jwt-access.strategy';
import { JwtGuard } from './strategies/jwt/jwt-access.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jwt } from '../entities/jwt.entity';
import { JwtService } from './jwt.service';
config();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: parseFloat(process.env.JWT_EXPIRATION),
      },
    }),
    TypeOrmModule.forFeature([Jwt]),
    ConfigModule.forFeature(auth),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalGuard,
    LocalStrategy,
    JwtAccessStrategy,
    JwtGuard,
    JwtService,
  ],
})
export class AuthModule {}
