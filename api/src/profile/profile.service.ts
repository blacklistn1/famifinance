import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getProfile(id: number) {
    return await this.userRepo.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }
}
