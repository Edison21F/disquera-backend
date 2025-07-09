import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Artista } from "./artistas.entity";
import { Estado } from "./estados.entity";

@Entity()
export class ArtistaAdquirido {
    @PrimaryGeneratedColumn()
    id_adquisicion: number;

    @ManyToOne(() => Artista)
    artista: Artista;

    @Column({ length: 100 })
    tipo_accion: string;

    @Column()
    fecha_adquisicion: Date;

    @Column()
    fecha_fin_adquisicion: Date;

    @Column({ length: 500 })
    url_contrato: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto_costo: number;

    @ManyToOne(() => Estado)
    estado: Estado;
}
