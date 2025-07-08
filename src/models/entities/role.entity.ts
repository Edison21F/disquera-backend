import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permission } from "./permission.entity";
import { UserRole } from "./user-role.entity";

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: true })
  is_active: boolean;

  @ManyToMany(() => Permission, permission => permission.roles)
@JoinTable({ 
  name: 'role_permissions',
  joinColumn: { name: 'role_id' },
  inverseJoinColumn: { name: 'permission_id' }
})
permissions: Permission[];

@OneToMany(() => UserRole, userRole => userRole.role)
userRoles: UserRole[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
