import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, NotEquals } from 'class-validator';

export class ProductVariationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  sizeId: number;
}
