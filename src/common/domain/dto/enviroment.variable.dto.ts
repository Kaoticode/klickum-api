import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class EnviromentVariableDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  MONGODB_URI: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  JWT_SECRET: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  SUPERADMIN_PASSWORD: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  SUPERADMIN_EMAIL: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  SUPERADMIN_USERNAME: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  PORT: number;
}
