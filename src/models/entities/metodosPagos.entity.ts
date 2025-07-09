import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class MetodoPago {
    @PrimaryGeneratedColumn()
    id_metodo_pago: number;

    @Column()
    nombre_metodo: string;
}
