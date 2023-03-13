import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../../entities';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { GoogleOAuthGuard } from '../../auth/guards';
import { TransactionService } from '../../transaction';
import { AddBalanceDto } from '../dtos/add-balance.dto';

@Injectable()
@UseGuards(GoogleOAuthGuard)
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private transactionService: TransactionService,
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
   * @param {AddBalanceDto} payload
   */
  async addBalance(user: User, payload: AddBalanceDto) {
    /* Get user balance */
    const profile = await this.getProfile(user.id);
    // Add to the balance and update the profile
    profile.balance += payload.amount;
    const updatedProfile = await this.profileRepo.save(profile);
    // Add to transactions in the "Add balance" category
    const newTransaction = {
      title: 'Add balance',
      description: payload.description || 'Add balance',
      categoryId: 1,
      amount: payload.amount,
    };
    return this.transactionService.addTransaction(
      newTransaction,
      updatedProfile.userId,
    );
  }
}
