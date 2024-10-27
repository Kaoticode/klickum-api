import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/model/product.entity';
import { Order } from '../../order/model/order.entity';

@Entity()
export class Item {
  @PrimaryColumn()
  productId: string;
  @PrimaryColumn()
  orderId: string;

  @ManyToOne(() => Product, (product) => product.items)
  @JoinColumn({ name: 'productId' })
  product: Product;
  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  amount: number;
}
