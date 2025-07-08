import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Artist } from "./artist.entity";
import { Song } from "./song.entity";
import { Album } from "./album.entity";

@Entity('artist_collaborations')
export class ArtistCollaboration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  primary_artist_id: number;

  @Column()
  collaborator_artist_id: number;

  @Column({
    type: 'enum',
    enum: ['featured', 'duet', 'producer', 'writer']
  })
  collaboration_type: string;

  @Column({ nullable: true })
  song_id: number;

  @Column({ nullable: true })
  album_id: number;

  @Column({ type: 'date', nullable: true })
  started_at: Date;

  @Column({ type: 'date', nullable: true })
  ended_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'primary_artist_id' })
  primaryArtist: Artist;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: 'collaborator_artist_id' })
  collaboratorArtist: Artist;

  @ManyToOne(() => Song)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @ManyToOne(() => Album)
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @CreateDateColumn()
  created_at: Date;
}