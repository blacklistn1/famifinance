import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, FindManyOptions } from 'typeorm';
import { Transaction } from '../entities';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Category, User } from '../entities';
import { UpdateTransactionDto } from '../common/dtos';

@Injectable()
export class TransactionService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private cateRepo: Repository<Category>,
  ) {}

  async onApplicationBootstrap() {
    /* Create add balance category */
    const category = await this.cateRepo.findOne({
      where: [
        {
          title: 'Add balance',
        },
        { id: 1 },
      ],
    });
    if (!category) {
      console.log(
        'Default Category "Add balance" not found. Adding category...',
      );
      const result = await this.cateRepo.insert({
        title: 'Add balance',
      });
      console.log(
        result.generatedMaps.length + ' record(s) generated. Next function...',
      );
    } else {
      console.log('Category found. Next function...');
    }
  }

  createOne(transaction: CreateTransactionDto, userId: number) {
    const newTransaction = this.repo.create(transaction);

    newTransaction.userId = userId;

    return this.repo.save(newTransaction);
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
