import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sexo } from "./sexo.entity";
import { Estado } from "./estados.entity";


@Entity()
export class Manager {
    @PrimaryGeneratedColumn()
    id_manager: number;

    @Column()
    nombre_artistico: string;

    @ManyToOne(() => Sexo)
    sexo: Sexo;

    @ManyToOne(() => Estado)
    estado: Estado;

    @Column()
    fecha_registro: Date;
}
