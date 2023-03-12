import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../entities';
import { User } from '../entities';
import { UserModule } from '../user';
import { Category } from '../entities';
import { SocialModule } from '../auth/modules/social.module';

@Module({
  imports: [
    SocialModule,
    TypeOrmModule.forFeature([Transaction, User, Category]),
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
