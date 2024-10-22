import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/model/product.entity';
import { Order } from '../../order/model/order.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { eager: true })
  product: Product;
  @ManyToOne(() => Order, { eager: true })
  order: Order;

  @Column()
  amount: number;
}
