import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ProductStatusEnum } from "../../../status/domain/status.enum";


export class UpdateStatusProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ProductStatusEnum)
  status: string;
}