import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ unique: true })
  session_token: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ length: 45, nullable: true })
  ip_address: string;

  @Column('text', { nullable: true })
  user_agent: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_activity: Date;
}
