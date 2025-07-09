import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Configuracion {
    @PrimaryGeneratedColumn()
    id_configuracion: number;

    @Column()
    clave: string;

    @Column()
    valor: string;
}
