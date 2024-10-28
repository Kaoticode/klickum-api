import { Entity, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { Image } from '../../common/model/image.entity';
import { Product } from './product.entity';

@Entity('product_images')
export class productImages {
  @PrimaryColumn()
  productId: string;
  @PrimaryColumn()
  imageId: string;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Image, (image) => image.products)
  @JoinColumn({ name: 'imageId' })
  image: Image;
}
