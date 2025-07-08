import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('status')
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  entity_type: string;

  @Column({ length: 7, nullable: true })
  color: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  sort_order: number;
}
