import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export enum RaffleStatusEnum {
  cancelled = "cancelled",
  available = "available",
}

export class UpdateRaffleStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(RaffleStatusEnum)
  status: string;
}