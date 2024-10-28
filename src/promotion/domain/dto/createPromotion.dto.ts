import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  MinLength,
  NotEquals,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionDto {
  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  name: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  end_date: Date;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @NotEquals(0)
  @NotEquals(100)
  @Max(90)
  percentage_discount: number;
}
