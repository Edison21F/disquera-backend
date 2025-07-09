import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./users.entity";


@Entity()
export class Notificacion {
    @PrimaryGeneratedColumn()
    id_notificacion: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @Column('text')
    mensaje: string;

    @Column({ type: 'datetime' })
    fecha: Date;

    @Column({ type: 'enum', enum: ['Leído', 'No leído'] })
    estado: string;
}
