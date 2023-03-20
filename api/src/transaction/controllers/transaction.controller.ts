import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { GoogleOAuthGuard } from '../../auth';
import { RequestWithUser } from '../../common/types';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionsService: TransactionService) {}

  @Post('/')
  @UseGuards(GoogleOAuthGuard)
  async createTransaction(
    @Req() req: RequestWithUser,
    @Body() body: CreateTransactionDto,
  ) {
    try {
      await this.transactionsService.addTransaction(body, req.user.id);
    } catch (e) {
      return e;
    }
  }

  @Get('/')
  @UseGuards(GoogleOAuthGuard)
  getTransactions(@Req() req: any, @Query() query: any) {
    return this.transactionsService.getTransactions(req.user.id, query);
  }

  @Patch('/:id')
  async updateTransaction(@Param('id') id: number) {}

  @Get('/categories-all')
  async getCategories() {
    try {
      return await this.transactionsService.getCategories();
    } catch (e) {
      return e;
    }
  }
}
