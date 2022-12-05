import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private repo: Repository<Transaction>,
  ) {}

  /**
   * Create new transaction
   * @param title
   */
  async create(title: string): Promise<Transaction> {
    const transaction = this.repo.create({ title });
    return await this.repo.save(transaction);
  }

  async find() {
    return await this.repo.find();
  }
}
