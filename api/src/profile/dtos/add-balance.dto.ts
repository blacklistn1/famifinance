import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddBalanceDto {
  @IsDefined()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  title?: string;
}
