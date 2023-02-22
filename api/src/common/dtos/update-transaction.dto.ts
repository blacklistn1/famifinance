import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsDefined()
  @IsNumber()
  userId: number;

  @IsOptional()
  categoryId?: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsDefined()
  @IsNumber()
  amount: number;
}
