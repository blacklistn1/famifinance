import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  UpdateResult,
  FindManyOptions,
  InsertResult,
  In,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  FindOptionsWhere,
} from 'typeorm';
import { Transaction } from '../../entities';
import { Category, User } from '../../entities';
import {
  AddBalanceDto,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '../dtos';
import { ProfileService } from '../../profile';
import * as moment from 'moment';
import { TransactionType } from '../../common/types';

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
      'Chuyển khoản',
      'Thanh toán',
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
    await this.profileService.changeBalance(
      userId,
      transaction.amount,
      transaction.type,
    );

    return this.repo.insert({
      ...transaction,
      transactionDate: transaction.transactionDate,
      userId,
    });
  }

  async addBalance(userId: number, payload: AddBalanceDto) {
    const addBalanceCate = await this.cateRepo.findOne({
      where: { title: 'Add balance' },
    });
    const newTransaction = {
      userId,
      title: 'Thêm vào số dư',
      description: payload.description || null,
      categoryId: addBalanceCate.id,
      type: 'thu' as const,
      transactionDate: new Date().toISOString(),
      amount: payload.amount,
    };
    return this.addTransaction(newTransaction, userId);
  }

  getTransactions(userId: number, query: any = {}): Promise<Transaction[]> {
    const findOptions: FindManyOptions<Transaction> = {
      order: { transactionDate: 'DESC' },
      take: 50,
      where: {
        transactionDate: Between(
          moment().startOf('month').toDate(),
          moment().endOf('month').toDate(),
        ),
      },
    };
    if (query.type) {
      // defaults to monthly and this month
      if (query.type === 'yearly') {
        const year = parseFloat(query.year) || new Date().getFullYear();
        Object.assign(findOptions.where, {
          transactionDate: Between(
            moment({ year }).startOf('year').toDate(),
            moment({ year }).endOf('year').toDate(),
          ),
        } as FindManyOptions<Transaction>);
      }
      if (query.type === 'monthly') {
        const year = query.year ? parseFloat(query.year) : moment().get('year');
        const month = query.month
          ? parseFloat(query.month) - 1
          : moment().get('month');
        Object.assign(findOptions.where, {
          transactionDate: Between(
            moment({ year, month }).startOf('month').toDate(),
            moment({ year, month }).endOf('month').toDate(),
          ),
        } as FindManyOptions<Transaction>);
      }
    }
    if (query.limit || query.take) {
      findOptions.take = +query.limit || +query.take;
    }
    if (query.categoryId) {
      Object.assign(findOptions.where, {
        categoryId: query.categoryId,
      } as FindManyOptions<Transaction>);
    }
    if (query.min) {
      const min = parseFloat(query.min);
      Object.assign(findOptions.where, {
        amount: MoreThanOrEqual(min),
      } as FindManyOptions<Transaction>);
    }
    if (query.max) {
      const max = parseFloat(query.max);
      Object.assign(findOptions.where, {
        amount: LessThanOrEqual(max),
      } as FindManyOptions<Transaction>);
    }
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

  mostRecentTransaction(userId: number) {
    return this.repo.find({
      where: { userId },
      order: {
        transactionDate: 'DESC',
      },
      take: 5,
      relations: {
        category: true,
      },
    });
  }

  getCategories(query: any = {}) {
    return this.cateRepo.find();
  }

  async getSumAmountByCategory(userId: number, query: any) {
    const result = [];
    const dateInput = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    };

    const findOptionsWhere: FindOptionsWhere<Transaction> = {
      userId,
    };
    if (query.cateId) {
      Object.assign(findOptionsWhere, {
        categoryId: parseFloat(query.cateId),
      });
    }
    if (query.month) {
      dateInput.month = parseFloat(query.month) - 1;
    }
    if (query.year) {
      dateInput.year = parseFloat(query.year);
    }
    const startDate = moment(dateInput).startOf('month');
    const endDate = moment(dateInput).endOf('month');
    Object.assign(findOptionsWhere, {
      transactionDate: Between(startDate.toDate(), endDate.toDate()),
    });

    if (findOptionsWhere.categoryId) {
      const category = await this.cateRepo.findOneBy({
        id: findOptionsWhere.categoryId,
      });
      const sumAmount = (await this.repo.sum('amount', findOptionsWhere)) || 0;
      return {
        category,
        sumAmount,
      };
    } else {
      const categories = await this.cateRepo.find();
      for (const c of categories) {
        const t = await this.repo.sum('amount', {
          ...findOptionsWhere,
          categoryId: c.id,
        });
        result.push({
          category: c,
          sumAmount: t || 0,
        });
      }
      return result;
    }
  }

  async updateTransaction(
    id: number,
    userId: number,
    payload: UpdateTransactionDto,
  ): Promise<Transaction> {
    try {
      const transaction = await this.repo.findOne({
        where: { id, userId },
      });
      const amount = payload.amount && payload.amount - transaction.amount;
      await this.profileService.changeBalance(
        userId,
        amount,
        transaction.type as TransactionType,
      );
      const res = await this.repo.update({ id, userId }, payload);
      if (res.generatedMaps.length) {
        return this.repo.findOne({
          where: { id, userId },
          relations: {
            category: true,
          },
        });
      }
    } catch (e) {
      return e;
    }
  }

  deleteTransaction(id: number): Promise<UpdateResult> {
    return this.repo.softDelete(id);
  }

  restoreTransaction(id: number): Promise<UpdateResult> {
    return this.repo.restore(id);
  }
}
