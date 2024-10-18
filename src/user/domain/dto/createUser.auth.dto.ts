import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserAuthDto {
  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  username: string;

  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }): string => (value as string).trim())
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  roleId: string;
}
