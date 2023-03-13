import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  direction?: 'in' | 'out';
}
