import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  NotEquals,
} from 'class-validator';

export class CreateItemDto {
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;
}
