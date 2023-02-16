import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Jwt } from '../entities';
import { RefreshToken } from '../common/types/refresh-token.type';
import { JwtPayload, Tokens } from '../common/types/jwt.type';

@Injectable()
export class JwtService {
  constructor(
    @InjectRepository(Jwt) private repo: Repository<Jwt>,
    private jwtService: NestJwtService,
    private configService: ConfigService,
  ) {}

  findOne(userId: number): Promise<Jwt> {
    return this.repo.findOne({
      where: { userId },
    });
  }

  async signToken(payload: JwtPayload): Promise<Tokens> {
    const { id, email } = payload;
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { id, email },
        {
          secret: this.configService.get('jwt.at_secret'),
          expiresIn: this.configService.get('jwt.at_expiration'),
        },
      ),
      this.jwtService.signAsync(
        { id, email },
        {
          secret: this.configService.get('jwt.rt_secret'),
          expiresIn: this.configService.get('jwt.rt_expiration'),
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  saveToken(token: RefreshToken): Promise<Jwt> {
    const newToken = this.repo.create(token);
    return this.repo.save(newToken);
  }

  refreshToken(payload: JwtPayload): Promise<Tokens> {
    return this.signToken(payload);
  }

  removeToken(token: string): Promise<DeleteResult> {
    return this.repo.delete({ token });
  }
}
