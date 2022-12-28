import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '../users/guards/auth.guard';
import { IsOwnerGuard } from './guards/is-owner.guard';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Post('/')
  async createTransaction(
    @Body() body: CreateTransactionDto,
    @CurrentUser() user: User,
  ) {
    return await this.transactionsService.createOne(body, user);
    // return await this.transactionsService.createOne(body);
  }

  @Get('/')
  async getTransactions(@CurrentUser() user: User) {
    return this.transactionsService.getTransactions(user);
  }
}
