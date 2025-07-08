import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Playlist } from "./playlist.entity";
import { Song } from "./song.entity";
import { User } from "./user.entity";

@Entity('playlist_songs')
export class PlaylistSong {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playlist_id: number;

  @Column()
  song_id: number;

  @Column()
  position: number;

  @Column()
  added_by: number;

  @ManyToOne(() => Playlist, playlist => playlist.playlistSongs)
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  @ManyToOne(() => Song)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @CreateDateColumn({ name: 'added_at' })
  added_at: Date;
}