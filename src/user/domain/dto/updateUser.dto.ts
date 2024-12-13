import { PartialType } from "@nestjs/mapped-types";
import { SignupUserDto } from "./signupUser.dto";
import { CreateUserDto } from "./createUser.dto";
import { IsBoolean, IsNumber, IsOptional, NotEquals } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(SignupUserDto) {
}

export class UpdateCreateDUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsNumber()
  @NotEquals(0)
  balance: number;
}
