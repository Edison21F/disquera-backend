import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./album.entity";

@Entity('album_contributors')
export class AlbumContributor {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  contributor_id: number;

  @Column({
    type: 'enum',
    enum: ['artist', 'producer', 'engineer', 'writer', 'external']
  })
  contributor_type: string;

  @Column({ length: 100, nullable: true })
  role_description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  contribution_percentage: number;

  @Column({ length: 100, nullable: true })
  credit_name: string;

  @ManyToOne(() => Album)
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @CreateDateColumn()
  created_at: Date;
}