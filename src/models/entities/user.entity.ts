import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Status } from './status.entity';
import { UserRole } from './user-role.entity';
import { UserPermission } from './user-permission.entity';
import { UserFavorite } from './user-favorite.entity';
import { Sale } from './sale.entity';
import { Playlist } from './playlist.entity';
import { UserSession } from './user-session.entity';
import { Notification } from './notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;


  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id' })
  status: Status;


  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserPermission, userPermission => userPermission.user)
  userPermissions: UserPermission[];

  @OneToMany(() => UserFavorite, favorite => favorite.user)
  favorites: UserFavorite[];

  @OneToMany(() => Sale, sale => sale.user)
  sales: Sale[];

  @OneToMany(() => Playlist, playlist => playlist.creator)
  playlists: Playlist[];

  @OneToMany(() => UserSession, session => session.user)
  sessions: UserSession[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}