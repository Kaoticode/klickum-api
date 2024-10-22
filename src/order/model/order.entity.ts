import { User } from '../../user/model/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Item } from '../../item/model/item.entity';

@Entity()
export class Order extends BaseEntity {
  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column()
  totalPrice: number;

  @Column({ default: false, nullable: true })
  isSent: boolean;

  @OneToMany((type) => Item, (item) => item.order)
  items: Item[];
}
