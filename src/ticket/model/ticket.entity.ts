import { User } from '../../user/model/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Item } from '../../item/model/item.entity';
import { Raffle } from '../../raffle/model/raffle.entity';

@Entity()
export class Ticket extends BaseEntity {
  @Column()
  code: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Raffle)
  raffle: Raffle;
}
