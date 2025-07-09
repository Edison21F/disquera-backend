import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Promocion {
    @PrimaryGeneratedColumn()
    id_promocion: number;

    @Column('text')
    descripcion: string;

    @Column()
    fecha_inicio: Date;

    @Column()
    fecha_fin: Date;

    @Column({ type: 'enum', enum: ['Activa', 'Inactiva'] })
    estado: string;
}
