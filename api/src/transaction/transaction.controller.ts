import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { CurrentUserDto } from './dtos/current-user.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionsService: TransactionService) {}

  @Post('/')
  createTransaction(@Body() body: CreateTransactionDto) {}

  @Get('/')
  @Serialize(CurrentUserDto)
  async getTransactions(@Query() query: any) {}

  @Patch('/:id')
  async updateTransaction(@Param('id') id: number) {}
}
