import { Body, Controller, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('/')
  async createTransaction(@Body() body: any) {
    return await this.transactionsService.createOne(body);
  }
}
