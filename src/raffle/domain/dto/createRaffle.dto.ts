import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
  ValidateNested,
} from 'class-validator';
import { CreateRewardDto } from './createReward.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRaffleDto {
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
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRewardDto)
  rewards: CreateRewardDto[];
}
