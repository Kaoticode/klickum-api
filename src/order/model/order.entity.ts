import { User } from '../../user/model/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Item } from '../../item/model/item.entity';
import { Status } from '../../status/model/status.entity';

@Entity()
export class Order extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Status)
  status: Status;

  @Column({ default: 0, nullable: true })
  totalPrice: number;

  @Column({ default: false, nullable: true })
  isSent: boolean;

  @OneToMany((type) => Item, (item) => item.order)
  items: Promise<Item[]>;
}
