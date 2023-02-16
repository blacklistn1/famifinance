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
import { AuthGuard } from '../users/guards/auth.guard';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../entities';
import { Serialize } from '../users/interceptors/serialize.interceptor';
import { CurrentUserDto } from './dtos/current-user.dto';

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
  }

  @Get('/')
  @Serialize(CurrentUserDto)
  async getTransactions(@CurrentUser() user: User) {
    return this.transactionsService.getTransactions(user);
  }

  @Patch('/:id')
  async updateTransaction(@Param('id') id: number, @CurrentUser() user: User) {
    return { id, user };
  }
}
