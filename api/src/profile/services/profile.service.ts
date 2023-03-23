import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../../entities';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { GoogleOAuthGuard } from '../../auth';
import { ProfileDto } from '../dtos/profile.dto';
import { UpdateProfileDto } from '../dtos';
import { TransactionType } from '../../common/types';

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

  getBalance(userId: number): Promise<Profile> {
    return this.profileRepo.findOne({
      where: { userId },
      select: {
        balance: true,
      },
    });
  }

  async changeBalance(userId: number, amount: number, type: TransactionType) {
    const userBalance = await this.getBalance(userId);
    if (type === 'thu') userBalance.balance += amount;
    else userBalance.balance -= amount;
    return this.profileRepo.update(
      { userId },
      {
        balance: userBalance.balance,
      },
    );
  }

  updateProfile(userId: number, payload: UpdateProfileDto) {
    return this.profileRepo.update({ userId }, payload);
  }
}
