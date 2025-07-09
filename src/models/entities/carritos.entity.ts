import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./users.entity";


@Entity()
export class Carrito {
    @PrimaryGeneratedColumn()
    id_carrito_prod: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @Column()
    id_carrito: number;

    @Column()
    id_producto: number;

    @Column()
    cantidad: number;
}
