import { Column, Entity, OneToMany } from 'typeorm';
import { Reward } from './reward.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { Ticket } from '../../ticket/model/ticket.entity';

@Entity()
export class Raffle extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  amount: number;

  @OneToMany((type) => Reward, (reward) => reward.raffle)
  rewards: Promise<Reward[]>;

  @OneToMany((type) => Ticket, (ticket) => ticket.raffle)
  tickets: Ticket[];
}
