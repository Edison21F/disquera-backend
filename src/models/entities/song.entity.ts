import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Album } from "./album.entity";
import { Artist } from "./artist.entity";
import { Genre } from "./genre.entity";
import { Status } from "./status.entity";

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;


  @Column({ type: 'time', nullable: true })
  duration: string;

  @Column({ type: 'year', nullable: true })
  release_year: number;


  @ManyToOne(() => Album)
  @JoinColumn({ name: 'album_id' })
  album: Album;

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