import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./users.entity";


@Entity()
export class Resena {
    @PrimaryGeneratedColumn()
    id_resena: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @Column()
    id_producto: number;

    @Column()
    calificacion: number;

    @Column('text')
    comentario: string;

    @Column({ type: 'datetime' })
    fecha: Date;
}
