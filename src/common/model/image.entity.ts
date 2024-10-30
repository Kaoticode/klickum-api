import { BaseEntity } from '../../common/model/base.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Product } from '../../product/model/product.entity';

@Entity()
export class Image extends BaseEntity {
  @Column()
  filename: string;
  @Column()
  mimetype: string;
  @Column()
  url: string;
  @Column()
  size: number;

  @ManyToMany(() => Product, (product) => product.images)
  products: Product[];
}
