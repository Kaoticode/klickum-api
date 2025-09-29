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
  pending = 'pending',
  processing = 'processing',
  shipped = 'shipped',
  delivered = 'delivered',
  cancelled = 'cancelled',
  refunded = 'refunded',
  completed = 'completed',
  onHold = 'onHold',
}
export enum ProductStatusEnum {
  available = 'available',
  outOfStock = 'outOfStock',
  discontinued = 'discontinued',
}

export type StatusType = keyof typeof StatusEnum;
export type StatusOrderType = keyof typeof OrderStatusEnum;
export type StatusProductType = keyof typeof ProductStatusEnum;

export const StatusOrderList = Object.values(OrderStatusEnum);
