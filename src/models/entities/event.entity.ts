import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Artist } from "./artist.entity";
import { Genre } from "./genre.entity";
import { Status } from "./status.entity";

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  event_date: Date;

  @Column({ type: 'time', nullable: true })
  event_time: string;

  @Column({ nullable: true })
  capacity: number;



  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => Genre)
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
