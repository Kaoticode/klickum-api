import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  NotEquals,
  ValidateNested,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  reward: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @NotEquals(0)
  usage_max: number;

  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;
}
