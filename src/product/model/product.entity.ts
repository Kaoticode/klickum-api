import { Item } from '../../item/model/item.entity';
import { Category } from '../../category/model/category.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Status } from 'src/status/model/status.entity';

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  amount: number;
  @Column()
  price: number;

  @ManyToOne(() => Status)
  status: Status;

  //@Column()
  // images: string[];

  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @OneToMany((type) => Item, (item) => item.product)
  items: Promise<Item[]>;
}
