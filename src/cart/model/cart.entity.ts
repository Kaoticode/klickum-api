import { User } from '../../user/model/user.entity';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { CartItem } from './cart.item.entity';

@Entity()
@Unique(['user'])
export class Cart extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: true,
  })
  totalPrice: number;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
