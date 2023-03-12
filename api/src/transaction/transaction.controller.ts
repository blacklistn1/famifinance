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
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { GoogleOAuthGuard } from '../auth/guards';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionsService: TransactionService) {}

  @Post('/')
  createTransaction(@Body() body: CreateTransactionDto) {}

  @Get('/')
  @UseGuards(GoogleOAuthGuard)
  getTransactions(@Req() req: any, @Query() query: any) {
    return this.transactionsService.getTransactions(req.user.id, query);
  }

  @Patch('/:id')
  async updateTransaction(@Param('id') id: number) {}
}
