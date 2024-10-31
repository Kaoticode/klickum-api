import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from '../../product/model/product.entity';
import { Raffle } from './raffle.entity';

@Entity()
export class Reward {
  @PrimaryColumn()
  productId: string;
  @PrimaryColumn()
  raffleId: string;

  @ManyToOne(() => Product, (product) => product.items)
  @JoinColumn({ name: 'productId' })
  product: Product;
  @ManyToOne(() => Raffle, (raffle) => raffle.rewards)
  @JoinColumn({ name: 'raffleId' })
  raffle: Raffle;

  @Column()
  amount: number;
}
