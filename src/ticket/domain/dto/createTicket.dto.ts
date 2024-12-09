import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  raffleId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  code: number;
}
