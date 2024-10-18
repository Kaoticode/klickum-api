import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Status {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;
}
