import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { NotBrackets, Repository } from 'typeorm';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import { dataSource } from '../../data-source';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
  ) {}

  async createOne(transaction: CreateTransactionDto, user: User) {
    const newTransaction = this.repo.create(transaction);

    newTransaction.user = user;

    return await this.repo.save(newTransaction);
  }

  async getTransactions(user: User) {
    return await this.repo.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
