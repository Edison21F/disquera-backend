import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { User } from "./user.entity";

@Entity('entity_categories')
export class EntityCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  entity_type: string;

  @Column()
  entity_id: number;

  @Column()
  category_id: number;

  @Column({ default: false })
  is_primary: boolean;

  @Column({ nullable: true })
  assigned_by: number;

  @ManyToOne(() => Category, category => category.entityCategories)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_by' })
  assignedBy: User;

  @CreateDateColumn({ name: 'assigned_at' })
  assigned_at: Date;
}