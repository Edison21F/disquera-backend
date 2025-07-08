import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Artist } from "./artist.entity";
import { Event } from "./event.entity";

@Entity('event_artists')
export class EventArtist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @Column({
    type: 'enum',
    enum: ['headliner', 'support', 'opening', 'special_guest']
  })
  performance_type: string;

  @Column({ nullable: true })
  performance_order: number;

  @Column({ nullable: true })
  set_duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fee_amount: number;

  @Column({ type: 'date', nullable: true })
  performance_date: Date;

  @Column({ type: 'time', nullable: true })
  performance_time: string;

  @Column({ type: 'time', nullable: true })
  soundcheck_time: string;

  @CreateDateColumn()
  created_at: Date;
}
