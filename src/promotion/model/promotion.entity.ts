import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';

@Entity()
export class Promotion extends BaseEntity {
  @Column()
  name: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  percentage_discount: number;
}
