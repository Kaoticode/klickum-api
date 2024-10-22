import { Category } from '../../category/model/category.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

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
  //@Column()
  // images: string[];

  @ManyToOne(() => Category, { eager: true })
  category: Category;
}
