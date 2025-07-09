import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Genero } from "./generos.entity";
import { Estado } from "./estados.entity";
import { Artista } from "./artistas.entity";


@Entity()
export class Evento {
    @PrimaryGeneratedColumn()
    id_evento: number;

    @Column()
    nombre_evento: string;

    @Column('text')
    descripcion: string;

    @Column()
    ubicacion: string;

    @Column()
    fecha_evento: Date;

    @Column()
    hora_evento: string; // TIME

    @Column()
    capacidad: number;

    @ManyToOne(() => Estado)
    estado: Estado;

    @ManyToOne(() => Genero)
    genero: Genero;

    @Column()
    contacto: string;

    @Column({ length: 255 })
    url_flyer_evento: string;

    @ManyToOne(() => Artista)
    artista: Artista;
}
