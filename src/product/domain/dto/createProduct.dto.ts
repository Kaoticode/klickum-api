import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  NotEquals,
} from 'class-validator';

export class CreateProductDto {
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  price: number;

  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;

  @Transform(({ value }): string => (value as string).trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  category: string;
}
