import { Product } from "./product.interface";
import { User } from "./user.interface";

export interface Orders extends Product {
    quantity: number;
    orderNumber: number;
    user: User;
    isSended: boolean;
}
