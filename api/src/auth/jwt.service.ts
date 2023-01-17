import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jwt } from '../entities/jwt.entity';
import { Repository } from 'typeorm';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    @InjectRepository(Jwt) private repo: Repository<Jwt>,
    private jwtService: NestJwtService,
    private configService: ConfigService,
  ) {}

  async findOne(email: string) {
    return await this.repo.findOne({
      where: { email },
    });
  }

  /**
   * Sign a new token
   * @return {Promise<Jwt>}
   * @param payload
   */
  async sign(payload: { email: string; id: number }) {
    const secret = this.configService.get<string>('JWT_SECRET');
    const token = await this.jwtService.signAsync(
      { id: payload.id, email: payload.email },
      { secret, expiresIn: this.configService.get<number>('JWT_EXPIRATION') },
    );
    const newToken = this.repo.create({
      email: payload.email,
      token,
      expiresAt:
        Date.now() + this.configService.get<number>('JWT_EXPIRATION') * 1000,
    });
    return await this.repo.save(newToken);
  }

  async revoke(email: string) {
    return await this.repo.delete({ email });
  }
}
