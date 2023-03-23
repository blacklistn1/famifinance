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
import {
  CreateTransactionDto,
  AddBalanceDto,
  UpdateTransactionDto,
} from '../dtos';
import { GoogleOAuthGuard } from '../../auth';
import { RequestWithUser } from '../../common/types';
import * as moment from 'moment';

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

  @Post('add-balance')
  @UseGuards(GoogleOAuthGuard)
  async addBalance(@Req() req: RequestWithUser, @Body() body: AddBalanceDto) {
    try {
      return await this.transactionsService.addBalance(req.user.id, body);
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  @Get('/')
  @UseGuards(GoogleOAuthGuard)
  async getTransactions(@Req() req: any, @Query() query: any) {
    try {
      return await this.transactionsService.getTransactions(req.user.id, query);
    } catch (e) {
      return e;
    }
  }

  @Get('most-recent')
  @UseGuards(GoogleOAuthGuard)
  async getMostRecentTransaction(@Req() req: RequestWithUser) {
    try {
      return await this.transactionsService.mostRecentTransaction(req.user.id);
    } catch (e) {
      return e;
    }
  }

  @Patch('/:id')
  @UseGuards(GoogleOAuthGuard)
  async updateTransaction(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() body: UpdateTransactionDto,
  ) {
    try {
      return await this.transactionsService.updateTransaction(
        id,
        req.user.id,
        body,
      );
    } catch (e) {
      return e;
    }
  }

  @Get('/sum-by-category')
  async sumOfAmountByCategory(@Query() query: any) {
    return await this.transactionsService.getSumAmountByCategory(1, query);
  }

  @Get('/categories-all')
  async getCategories(@Query() query: any) {
    try {
      return await this.transactionsService.getCategories(query);
    } catch (e) {
      return e;
    }
  }
}
