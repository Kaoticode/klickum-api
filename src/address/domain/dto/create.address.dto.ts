import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MinLength,
  NotEquals,
  ValidateNested,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => (value as string).trim())
  @MinLength(2)
  zipcode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => (value as string).trim())
  streetNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => (value as string).trim())
  streetName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  @Type(() => Number)
  @IsNumber()
  countryId: number;

  @ApiProperty()
  @IsNotEmpty()
  cityName: string;
}
