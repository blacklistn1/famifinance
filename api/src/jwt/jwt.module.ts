import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { Jwt } from '../entities';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jwt]),
    NestJwtModule.register({}),
    ConfigModule,
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
