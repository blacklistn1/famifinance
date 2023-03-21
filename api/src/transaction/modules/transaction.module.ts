import { Module } from '@nestjs/common';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionService } from '../services/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, Category, Transaction, User } from '../../entities';
import { UserModule } from '../../user';
import { SocialModule } from '../../auth';
import { ProfileModule } from '../../profile';

@Module({
  imports: [
    SocialModule,
    ProfileModule,
    TypeOrmModule.forFeature([Transaction, Profile, User, Category]),
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
