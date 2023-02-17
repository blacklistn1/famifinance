import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { CurrentUserDto } from './dtos/current-user.dto';
import { JwtAccessGuard } from '../auth/strategies';
import { JwtPayload } from '../common/types';
import { Transaction } from '../entities';

@Controller('transactions')
@UseGuards(JwtAccessGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('/')
  createTransaction(
    @Body() body: CreateTransactionDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<Transaction> {
    return this.transactionsService.createOne(body, user.id);
  }

  @Get('/')
  @Serialize(CurrentUserDto)
  async getTransactions(@CurrentUser() user: JwtPayload) {
    return this.transactionsService.getTransactions(user.id);
  }

  @Patch('/:id')
  async updateTransaction(
    @Param('id') id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return { id, user };
  }
}
