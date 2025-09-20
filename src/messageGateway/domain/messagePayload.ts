export type useCase =
  | 'register'
  | 'login'
  | 'successPurchase'
  | 'balanceUpdate'
  | 'purchaseUpdate';

export interface MessagePayload {
  number: string;
  name?: string;
  email?: string;
  useCase: useCase;
}
