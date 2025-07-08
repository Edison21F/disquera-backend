import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Genre } from "./genre.entity";
import { Country } from "./country.entity";
import { Status } from "./status.entity";

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;


  @Column()
  status_id: number;

  @ManyToOne(() => Genre)
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}