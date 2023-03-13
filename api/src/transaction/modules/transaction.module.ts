import { Module } from '@nestjs/common';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionService } from '../services/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../entities';
import { User } from '../../entities';
import { UserModule } from '../../user';
import { Category } from '../../entities';
import { SocialModule } from '../../auth/modules/social.module';

@Module({
  imports: [
    SocialModule,
    TypeOrmModule.forFeature([Transaction, User, Category]),
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
