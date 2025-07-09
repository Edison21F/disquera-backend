import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Genero } from "./generos.entity";
import { Pais } from "./paises.entity";
import { Estado } from "./estados.entity";

@Entity()
export class Artista {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nombre: string;

    @ManyToOne(() => Genero)
    genero: Genero;

    @ManyToOne(() => Pais)
    pais: Pais;

    @Column('text')
    biografia: string;

    @ManyToOne(() => Estado)
    estado: Estado;

    @Column({ length: 255 })
    foto_url: string;
}
