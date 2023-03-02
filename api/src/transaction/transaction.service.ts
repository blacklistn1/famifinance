import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Transaction } from '../entities';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Category, User } from '../entities';
import { UpdateTransactionDto } from '../common/dtos';
import { FindOptions } from '@nestjs/schematics';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private cateRepo: Repository<Category>,
  ) {}

  createOne(transaction: CreateTransactionDto, userId: number) {
    const newTransaction = this.repo.create(transaction);

    newTransaction.userId = userId;

    return this.repo.save(newTransaction);
  }

  getTransactions(userId: number, options: any): Promise<Transaction[]> {
    const findOptions: FindOptions = options;
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
