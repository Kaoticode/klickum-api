import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  NotEquals,
  ValidateNested,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;
}

export class CreateCompleteOrderDto {
  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  addressId: string;

  @ApiProperty({ type: [CreateItemDto] })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
}
