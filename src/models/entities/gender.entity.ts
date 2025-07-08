import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('genders')
export class Gender {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  name: string;
}