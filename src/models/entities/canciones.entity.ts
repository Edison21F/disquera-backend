import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./albums.entity";
import { Genero } from "./generos.entity";
import { Estado } from "./estados.entity";
import { Artista } from "./artistas.entity";

@Entity()
export class Cancion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    titulo: string;

    @ManyToOne(() => Album)
    album: Album;

    @Column()
    duracion: string; // TIME

    @Column()
    año: number;

    @ManyToOne(() => Genero)
    genero: Genero;

    @ManyToOne(() => Estado)
    estado: Estado;

    @Column({ length: 255 })
    foto_url: string;

    @ManyToOne(() => Artista)
    artista: Artista;
}
