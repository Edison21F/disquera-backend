import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 100 })
  resource: string;

  @Column({ nullable: true })
  resource_id: number;

  @Column('json', { nullable: true })
  old_values: any;

  @Column('json', { nullable: true })
  new_values: any;

  @Column({ length: 45, nullable: true })
  ip_address: string;

  @Column('text', { nullable: true })
  user_agent: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}