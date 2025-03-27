import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UseCouponDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code: string;
}
