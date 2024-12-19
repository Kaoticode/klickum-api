import { BaseEntity } from "../../common/model/base.entity";
import { Role } from "../../role/model/role.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  phone: string;
  @Column()
  email: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 2 })
  balance: number;

  @ManyToOne(() => Role, { eager: true })
  role: Role;
}
