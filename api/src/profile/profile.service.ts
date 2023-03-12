import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { GoogleOAuthGuard } from '../auth/guards';

@Injectable()
@UseGuards(GoogleOAuthGuard)
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  getProfile(id: number) {
    return this.profileRepo.findOne({
      where: { userId: id },
      relations: {
        user: true,
      },
    });
  }

  /**
   * Get user balance (through finding profile).
   * Add to the balance and update the profile.
   * Add to transactions in the "Add balance" category.
   * @param {RequestWithUser} user
   * @param {number} amount
   */
  async addBalance(user: User, amount: number) {
    const profile = await this.getProfile(user.id);
    profile.balance += amount;
    return this.profileRepo.save(profile);
  }
}
