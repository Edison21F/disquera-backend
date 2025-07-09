import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Pais {
    @PrimaryGeneratedColumn()
    id_pais: number;

    @Column()
    nombre_pais: string;
}
