import { Expose, Type } from 'class-transformer';
import { CurrentUserTransactionsDto } from './current-user-transactions.dto';

export class CurrentUserTransactionParentDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Type(() => CurrentUserTransactionsDto)
  transactions: CurrentUserTransactionsDto[];
}
