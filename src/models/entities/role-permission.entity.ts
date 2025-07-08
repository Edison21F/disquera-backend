import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import { User } from "./user.entity";

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role_id: number;

  @Column()
  permission_id: number;

  @Column({ nullable: true })
  granted_by: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'granted_by' })
  grantedBy: User;

  @CreateDateColumn({ name: 'granted_at' })
  granted_at: Date;
}