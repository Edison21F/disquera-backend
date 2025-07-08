import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Artist } from "./artist.entity";
import { Status } from "./status.entity";

@Entity('artist_acquisitions')
export class ArtistAcquisition {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({ length: 100 })
  action_type: string;

  @Column({ type: 'date' })
  acquisition_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost_amount: number;



  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
