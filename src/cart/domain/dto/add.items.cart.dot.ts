import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, NotEquals } from 'class-validator';

export class AddItemsCartDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  productVariantId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;
}
