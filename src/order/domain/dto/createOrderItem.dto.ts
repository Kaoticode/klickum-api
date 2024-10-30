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

export class CreateOrderItemDto {
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;
}
