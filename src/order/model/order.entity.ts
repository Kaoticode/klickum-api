import { User } from '../../user/model/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Status } from '../../status/model/status.entity';
import { Address } from '../../address/model/address.entity';
import { Item } from './item.entity';

@Entity()
export class Order extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Status)
  status: Status;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: true,
  })
  totalPrice: number;

  @Column({ default: false, nullable: true })
  isSent: boolean;

  @OneToMany((type) => Item, (item) => item.order)
  items: Item[];

  @ManyToOne(() => Address, { nullable: true })
  address: Address;
}
