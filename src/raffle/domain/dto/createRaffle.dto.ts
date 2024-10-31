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

export class CreateRaffleDto {
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  price: number;

  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRewardDto)
  rewards: CreateRewardDto[];
}
