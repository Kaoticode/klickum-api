import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  StatusOrderList,
  StatusOrderType,
  StatusType,
} from '../../../status/domain/status.enum';

export class UpdateOrderDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isSent?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsIn(StatusOrderList)
  status?: StatusOrderType;
}
