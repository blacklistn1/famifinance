import { Expose } from 'class-transformer';

export class CurrentUserTransactionCateDto {
  @Expose()
  id: number;

  @Expose()
  title: string;
}
