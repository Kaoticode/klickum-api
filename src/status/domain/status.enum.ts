export enum StatusEnum {
  pending = 'pending',
  processing = 'processing',
  shipped = 'shipped',
  delivered = 'delivered',
  cancelled = 'cancelled',
  refunded = 'refunded',
  completed = 'completed',
  onHold = 'onHold',
  available = 'available',
  outOfStock = 'outOfStock',
  discontinued = 'discontinued',
}

export enum OrderStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFENDED = 'refunded',
  COMPLETED = 'completed',
  ONHOLD = 'onHold',
}
export enum ProductStatusEnum {
  AVAILABLE = 'available',
  OUTOFSTOCK = 'outOfStock',
  DISCONTINUED = 'discontinued',
}

export type StatusType = keyof typeof StatusEnum;
export type StatusOrderType = keyof typeof OrderStatusEnum;
export type StatusProductType = keyof typeof ProductStatusEnum;
