import { Expose, Type } from 'class-transformer';

class CurrentUserTransactionCateDto {
  @Expose()
  id: number;

  @Expose()
  title: string;
}

class CurrentUserTransactionsDto {
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

export class CurrentUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Type(() => CurrentUserTransactionsDto)
  transactions: CurrentUserTransactionsDto[];
}
