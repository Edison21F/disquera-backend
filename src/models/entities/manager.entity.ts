import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Gender } from "./gender.entity";
import { Status } from "./status.entity";

@Entity('managers')
export class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  artistic_name: string;

 

  @ManyToOne(() => Gender)
  @JoinColumn({ name: 'gender_id' })
  gender: Gender;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}