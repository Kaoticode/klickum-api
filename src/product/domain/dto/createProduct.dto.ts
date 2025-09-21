import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  NotEquals,
  ValidateNested,
} from 'class-validator';
import {
  ProductSize,
  ProductSizeList,
  ProductType,
} from '../product.metadata.interface';

export class MetadataDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(ProductSizeList)
  size?: ProductSize;

  @ApiProperty()
  @IsOptional()
  @IsString()
  url?: string;
}

export class CreateProductDto {
  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  price: number;

  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @NotEquals(0)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  promoted: boolean;

  @ApiProperty()
  @Transform(({ value }): string => (value as string).trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  category: string;

  @ApiProperty({ enum: ['physical', 'digital'] })
  @IsOptional()
  @IsString()
  @IsIn(['physical', 'digital'])
  productType: ProductType = 'physical';

  @ApiProperty({ type: MetadataDto })
  @Type(() => MetadataDto)
  @ValidateNested()
  metadata: MetadataDto;
}
