import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./users.entity";


@Entity()
export class Comentario {
    @PrimaryGeneratedColumn()
    id_comentario: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @Column()
    id_producto: number;

    @Column('text')
    comentario: string;

    @Column({ type: 'datetime' })
    fecha: Date;
}
