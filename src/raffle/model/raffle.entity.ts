import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Reward } from './reward.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { Ticket } from '../../ticket/model/ticket.entity';
import { Status } from '../../status/model/status.entity';

@Entity()
export class Raffle extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  amount: number;

  @ManyToOne(() => Status)
  status: Status;

  @OneToMany((type) => Reward, (reward) => reward.raffle)
  rewards: Promise<Reward[]>;

  @OneToMany((type) => Ticket, (ticket) => ticket.raffle)
  tickets: Ticket[];
}
