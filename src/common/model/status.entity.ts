import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
