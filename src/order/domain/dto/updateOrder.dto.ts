import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isSent?: boolean;
}
