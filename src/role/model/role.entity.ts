import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Action } from '../domain/action.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  name: string;
  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: Action;
}
