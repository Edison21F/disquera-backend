import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estado } from './estados.entity';
import { Rol } from './roles.entity';
import { Sexo } from './sexo.entity';
import { Pais } from './paises.entity';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id_usuario: number; 

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({ unique: true })
    correo: string;

    @Column()
    contraseña: string;

    @ManyToOne(() => Estado)
    estado: Estado;

    @ManyToOne(() => Rol)
    rol: Rol;

    @Column()
    fecha_registro: Date;

    @ManyToOne(() => Sexo)
    sexo: Sexo;

    @ManyToOne(() => Pais)
    pais: Pais;
}
