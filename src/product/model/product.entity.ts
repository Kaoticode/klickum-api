import { Category } from 'src/category/model/category.entity';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Product {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  amount: number;
  @Column()
  price: number;
  @Column()
  images: string[];
  @Column()
  isActive: boolean;

  @Column((type) => Category)
  category: Category;
}
