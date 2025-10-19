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

export class ItemsToProcessDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @NotEquals(0)
  productVariantId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;
}

export class CreateDirectOrderDto {
  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  addressId: string;

  @ApiProperty({ type: [ItemsToProcessDto] })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemsToProcessDto)
  items: ItemsToProcessDto[];
}
