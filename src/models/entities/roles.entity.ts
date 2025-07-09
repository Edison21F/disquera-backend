import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Rol {
    @PrimaryGeneratedColumn()
    id_rol: number;

    @Column()
    nombre_rol: string;

    @Column()
    description: string;
}
