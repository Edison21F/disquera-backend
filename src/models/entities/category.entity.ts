import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EntityCategory } from "./entity-category.entity";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  parent_id: number;

  @Column({ default: 0 })
  level: number;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ length: 100, nullable: true })
  icon: string;

  @Column({ length: 7, nullable: true })
  color: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @OneToMany(() => EntityCategory, entityCategory => entityCategory.category)
  entityCategories: EntityCategory[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}