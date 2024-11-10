import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProcessOrderDto {
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  api_key: string;

  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsOptional()
  payment_code?: string;
}
