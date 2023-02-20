import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { User } from '../entities';
import { Category } from '../entities';

@Injectable()
export class TransactionsService {
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

  getTransactions(userId: number): Promise<User> {
    return this.userRepo.findOne({
      where: {
        id: userId,
      },
      relations: {
        transactions: {
          category: true,
        },
      },
    });
  }

  updateTransaction(id: number, user: User) {
    return 1;
  }
}
