import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Artist } from "./artist.entity";
import { Manager } from "./manager.entity";

@Entity('artist_managers')
export class ArtistManager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  artist_id: number;

  @Column()
  manager_id: number;

  @Column({
    type: 'enum',
    enum: ['primary', 'secondary', 'booking', 'touring']
  })
  relationship_type: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  commission_percentage: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ length: 500, nullable: true })
  contract_url: string;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => Manager)
  @JoinColumn({ name: 'manager_id' })
  manager: Manager;

  @CreateDateColumn()
  created_at: Date;
}