import { Product } from "./product.interface";

export interface Orders extends Product {
    quantity: number;
    orderNumber: number;
    isPending: boolean;
}
