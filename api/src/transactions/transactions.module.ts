import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../entities';
import { User } from '../entities';
import { UsersModule } from '../users/users.module';
import { Category } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Category]),
    UsersModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
