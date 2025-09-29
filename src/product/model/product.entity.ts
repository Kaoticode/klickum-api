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
import {
  ProductGroup,
  ProductMetadata,
} from '../domain/product.metadata.interface';
import { ProductVariant } from './productVariant.entity';

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

  @Column({ default: false })
  promoted: boolean;

  @Column({ nullable: true })
  group?: ProductGroup;

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

  @Column({
    type: 'jsonb',
    default: () => "'{}'",
    nullable: true,
  })
  metadata: ProductMetadata;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];
}
