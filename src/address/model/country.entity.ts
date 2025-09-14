import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  nombre: string;

  @Column()
  name: string;

  @Column()
  nom: string;

  @Column()
  iso2: string;

  @Column()
  iso3: string;

  @Column()
  phone_code: string;
}
