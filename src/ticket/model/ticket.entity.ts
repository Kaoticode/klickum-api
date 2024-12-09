import { User } from "../../user/model/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/model/base.entity";
import { Raffle } from "../../raffle/model/raffle.entity";

@Entity()
export class Ticket extends BaseEntity {
  @Column()
  code: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Raffle)
  raffle: Raffle;
}
