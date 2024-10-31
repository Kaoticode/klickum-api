import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  NotEquals,
} from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;
}
