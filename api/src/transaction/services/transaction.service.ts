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
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { Category, User } from '../../entities';
import { UpdateTransactionDto } from '../../common/dtos';

@Injectable()
export class TransactionService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private cateRepo: Repository<Category>,
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

  addTransaction(
    transaction: CreateTransactionDto,
    userId: number,
  ): Promise<InsertResult> {
    return this.repo.insert({
      ...transaction,
      userId,
    });
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

  updateTransaction(
    id: number,
    userId: number,
    payload: UpdateTransactionDto,
  ): Promise<UpdateResult> {
    return this.repo.update({ id, userId }, payload);
  }

  deleteTransaction(id: number): Promise<UpdateResult> {
    return this.repo.softDelete(id);
  }

  restoreTransaction(id: number): Promise<UpdateResult> {
    return this.repo.restore(id);
  }
}
