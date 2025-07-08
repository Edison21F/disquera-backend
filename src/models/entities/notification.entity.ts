import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  message: string;

  @Column({ length: 50 })
  type: string; // 'info', 'warning', 'success', 'error'

  @Column({ default: false })
  is_read: boolean;

  @Column({ length: 255, nullable: true })
  action_url: string;

  @Column('json', { nullable: true })
  metadata: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  read_at: Date;
}