import { Item } from '../../item/model/item.entity';
import { Category } from '../../category/model/category.entity';
import { BaseEntity } from '../../common/model/base.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Status } from '../../status/model/status.entity';
import { Image } from '../../common/model/image.entity';

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  amount: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Status)
  status: Status;

  @ManyToMany(() => Image, { cascade: true })
  @JoinTable({
    name: 'product_images',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'imageId', referencedColumnName: 'id' },
  })
  images: Image[];

  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @OneToMany((type) => Item, (item) => item.product)
  items: Promise<Item[]>;
}
