import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private cateRepo: Repository<Category>,
  ) {}

  async createOne(transaction: CreateTransactionDto, user: User) {
    const newTransaction = this.repo.create(transaction);

    newTransaction.user = user;

    return await this.repo.save(newTransaction);
  }

  async getTransactions(user: User) {
    return await this.userRepo.findOne({
      where: {
        id: user.id,
      },
      relations: {
        transactions: {
          category: true,
        },
      },
    });
  }

  async updateTransaction(id: number, user: User) {
    return await this.repo.findOneBy({ id });
  }
}
