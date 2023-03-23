import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsDefined()
  @IsNumber()
  amount: number;

  @IsDefined()
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
