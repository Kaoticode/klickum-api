import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/domain/dto/pagination.dto';

// Nested DTO for 'metadata'
class ProductMetadataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  url?: string;
}

// Nested DTO for 'status'
class ProductStatusDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

// Nested DTO for 'category'
class ProductCategoryDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

class SizeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;
}

class ProducVariantDto {
  @ApiProperty()
  @IsNumber()
  id: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ type: SizeDto })
  size: SizeDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  updated_at: string;
}

// Main DTO for the product
class ProductReponseV2Dto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  updated_at: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  promoted: boolean;

  @ApiProperty({ type: ProductMetadataDto })
  @ValidateNested()
  @Type(() => ProductMetadataDto)
  metadata: ProductMetadataDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  group: string;

  @ApiProperty({ type: ProductStatusDto })
  @ValidateNested()
  @Type(() => ProductStatusDto)
  status: ProductStatusDto;

  @ApiProperty({ type: ProductCategoryDto })
  @ValidateNested()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  images: string[];

  @ApiProperty({ type: [ProducVariantDto] })
  @ValidateNested({ each: true })
  @Type(() => ProducVariantDto)
  variants: ProducVariantDto[];
}

export class PaginatedProductV2ReponseDto extends PaginationDto<ProductReponseV2Dto> {
  @ApiProperty({ type: [ProductReponseV2Dto] })
  items: ProductReponseV2Dto[];
}
