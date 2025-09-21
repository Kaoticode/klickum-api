export type ProductType = 'physical' | 'digital';
export type ProductSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export const ProductSizeList = ['xs', 's', 'm', 'l', 'xl'];

export interface ProductMetadata {
  productType: ProductType;
  size?: ProductSize;
  url?: string;
}
