import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Genero {
    @PrimaryGeneratedColumn()
    id_genero: number;

    @Column()
    nombre_genero: string;
}
