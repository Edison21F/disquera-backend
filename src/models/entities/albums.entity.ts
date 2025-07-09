import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Artista } from "./artistas.entity";
import { Genero } from "./generos.entity";
import { Estado } from "./estados.entity";

@Entity()
export class Album {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    titulo: string;

    @ManyToOne(() => Artista)
    artista: Artista;

    @Column()
    año: number;

    @ManyToOne(() => Genero)
    genero: Genero;

    @ManyToOne(() => Estado)
    estado: Estado;

    @Column({ length: 255 })
    foto_url: string;
}
