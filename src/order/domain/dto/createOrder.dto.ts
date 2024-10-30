import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from './createOrderItem.dto';

export class CreateOrderDto {
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
