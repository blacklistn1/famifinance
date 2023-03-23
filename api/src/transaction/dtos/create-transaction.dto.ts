import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsNumber()
  amount: number;

  @IsDefined()
  @IsDateString()
  transactionDate: string;

  @IsDefined()
  @IsString()
  type: 'thu' | 'chi';

  @IsOptional()
  @IsString()
  description?: string;
}
