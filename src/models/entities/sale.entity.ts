import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Status } from "./status.entity";

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({
    type: 'enum',
    enum: ['album', 'song', 'merchandise']
  })
  product_type: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sale_date: Date;


  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id' })
  status: Status;
}