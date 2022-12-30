import { Expose, Type } from 'class-transformer';
import { CurrentUserTransactionCateDto } from './current-user-transaction-cate.dto';

export class CurrentUserTransactionsDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CurrentUserTransactionCateDto)
  category: CurrentUserTransactionCateDto;

  @Expose()
  amount: string;

  @Expose({ name: 'updatedAt' })
  @Type(() => Date)
  lastUpdated: Date;
}
