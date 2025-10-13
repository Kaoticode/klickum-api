import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty() id: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
  @ApiProperty() name: string;
}

export class ProductMetadataDto {
  @ApiProperty() productType: string;
}

export class ProductDto {
  @ApiProperty() id: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() amount: number;
  @ApiProperty() price: string;
  @ApiProperty() promoted: boolean;
  @ApiProperty() group: string;
  @ApiProperty({ type: ProductMetadataDto }) metadata: ProductMetadataDto;
  @ApiProperty({ type: CategoryDto }) category: CategoryDto;
}

export class ProductVariantDto {
  @ApiProperty() id: number;
  @ApiProperty() sku: string;
  @ApiProperty({ nullable: true }) price: string | null;
  @ApiProperty() amount: number;
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
  @ApiProperty({ type: ProductDto }) product: ProductDto;
}

export class CartItemDto {
  @ApiProperty() id: string;
  @ApiProperty() amount: number;
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
  @ApiProperty({ type: ProductVariantDto }) productVariant: ProductVariantDto;
}

export class CartDtoDcos {
  @ApiProperty() id: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() created_at: string;
  @ApiProperty() updated_at: string;
  @ApiProperty() totalPrice: string;
  @ApiProperty({ type: [CartItemDto] }) items: CartItemDto[];
}
