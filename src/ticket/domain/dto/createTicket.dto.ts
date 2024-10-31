import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  raffleId: string;
}
