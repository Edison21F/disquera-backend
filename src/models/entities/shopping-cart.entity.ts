import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('shopping_cart')
export class ShoppingCart {
  @PrimaryGeneratedColumn()
  id: number;

  

  @Column()
  product_id: number;

  @Column({
    type: 'enum',
    enum: ['album', 'song', 'merchandise']
  })
  product_type: string;

  @Column()
  quantity: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'added_at' })
  added_at: Date;
}