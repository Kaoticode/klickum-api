import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { Action } from '../domain/action.enum';

@Entity()
export class Permission {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column()
  action: Action;
}

@Entity()
export class Role {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column({ unique: false })
  name: string;
  @Column((type) => Permission)
  permissions: Permission[];
}
