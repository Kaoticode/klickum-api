import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { City } from './city.entity';
import { User } from '../../user/model/user.entity';

@Entity()
export class Address extends BaseEntity {
  //zipcode, number, street name
  @Column()
  zipcode: string;

  @Column()
  streetNumber: string;

  @Column()
  streetName: string;

  @ManyToOne(() => City, { eager: true, nullable: false })
  city: City;

  @ManyToOne(() => User, { nullable: false })
  user: User;
}
