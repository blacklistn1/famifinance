import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  UpdateResult,
  FindManyOptions,
  InsertResult,
  In,
} from 'typeorm';
import { Transaction } from '../../entities';
import { Category, User } from '../../entities';
import {
  AddBalanceDto,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '../dtos';
import { ProfileService } from '../../profile';

@Injectable()
export class TransactionService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private cateRepo: Repository<Category>,
    private profileService: ProfileService,
  ) {}

  async onApplicationBootstrap() {
    const defaultCategories = [
      'Add balance',
      'Tiền xăng xe',
      'Tiền ăn',
      'Tiền điện',
      'Tiền nước',
      'Tiền internet',
      'Tiệc cưới',
      'Học phí',
      'Viện phí',
    ];

    /* Search for default categories */
    const categories = await this.cateRepo.find({
      where: { title: In(defaultCategories) },
    });

    if (!categories.length) {
      console.log('Default categories not found. Adding categories...');
      const result = await this.cateRepo.insert(
        defaultCategories.map((el) => ({ title: el })),
      );
      console.log(
        result.generatedMaps.length + ' record(s) generated. Next function...',
      );
    } else {
      console.log('Categories found. Next function...');
    }
  }

  async addTransaction(
    transaction: CreateTransactionDto,
    userId: number,
  ): Promise<InsertResult> {
    if (transaction.type === 'thu') {
      await this.profileService.changeBalance(userId, transaction.amount);
    } else {
      await this.profileService.changeBalance(userId, -transaction.amount);
    }
    return this.repo.insert({
      ...transaction,
      transactionDate: new Date(Date.parse(transaction.transactionDate)),
      userId,
    });
  }

  async addBalance(user: User, payload: AddBalanceDto) {
    const addBalanceCate = await this.cateRepo.findOne({
      where: { title: 'Add balance' },
    });
    const newTransaction = {
      userId: user.id,
      title: 'Thêm vào số dư',
      description: payload.description || null,
      categoryId: addBalanceCate.id,
      type: 'thu' as const,
      transactionDate: new Date().toISOString(),
      amount: payload.amount,
    };
    return this.addTransaction(newTransaction, user.id);
  }

  getTransactions(userId: number, options: any = {}): Promise<Transaction[]> {
    const findOptions: FindManyOptions<Transaction> = options;
    findOptions.order = {
      createdAt: 'desc',
    };
    return this.repo.find({
      where: {
        userId,
      },
      relations: {
        user: true,
        category: true,
      },
      ...findOptions,
    });
  }

  getCategories() {
    return this.cateRepo.find();
  }

  async updateTransaction(
    id: number,
    userId: number,
    payload: UpdateTransactionDto,
  ): Promise<Transaction> {
    const [transaction] = await this.getTransactions(userId, {
      where: { id },
    });
    Object.assign(transaction, payload);
    return this.repo.save(transaction);
  }

  deleteTransaction(id: number): Promise<UpdateResult> {
    return this.repo.softDelete(id);
  }

  restoreTransaction(id: number): Promise<UpdateResult> {
    return this.repo.restore(id);
  }
}
