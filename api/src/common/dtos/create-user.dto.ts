import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsBoolean()
  emailVerified: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  locale: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  picture: string;
}
