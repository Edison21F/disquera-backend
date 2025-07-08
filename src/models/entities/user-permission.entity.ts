import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Permission } from "./permission.entity";

@Entity('user_permissions')
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  permission_id: number;

  @Column({ default: true })
  granted: boolean;

  @Column({ nullable: true })
  granted_by: number;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'granted_by' })
  grantedBy: User;

  @CreateDateColumn({ name: 'granted_at' })
  granted_at: Date;
}