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

// Main DTO for the product
export class ProductReponseDto {
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
}

export class PaginatedProductReponseDto extends PaginationDto<ProductReponseDto> {
  @ApiProperty({ type: [ProductReponseDto] })
  items: ProductReponseDto[];
}
