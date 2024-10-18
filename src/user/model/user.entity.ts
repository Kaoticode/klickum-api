import { Role } from 'src/role/model/role.entity';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  phone: string;
  @Column()
  email: string;
  @Column()
  isActive: boolean;
  @Column((type) => Role)
  role: Role;
}
