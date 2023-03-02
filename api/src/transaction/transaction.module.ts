import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../entities';
import { User } from '../entities';
import { UserModule } from '../user';
import { Category } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Category]),
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
