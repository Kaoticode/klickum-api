import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, NotEquals } from 'class-validator';

export class CheckoutItemsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressId: string;
}
