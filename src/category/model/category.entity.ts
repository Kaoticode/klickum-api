import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Category {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;
  @Column()
  isActive: boolean;
}
