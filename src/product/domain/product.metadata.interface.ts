export type ProductType = 'physical' | 'digital';
export type ProductSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export const ProductSizeList = ['xs', 's', 'm', 'l', 'xl'];

export type ProductGroup = 'simple' | 'variable';

export const ProductGroupList = ['simple', 'variable'];

export interface ProductMetadata {
  productType: ProductType;
  size?: ProductSize;
  url?: string;
}
