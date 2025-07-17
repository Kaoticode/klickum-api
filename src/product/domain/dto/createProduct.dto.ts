import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  NotEquals,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  price: number;

  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  promoted: boolean;

  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  category: string;
}
