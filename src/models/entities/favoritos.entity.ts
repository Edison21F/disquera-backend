import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./users.entity";


@Entity()
export class Favorito {
    @PrimaryGeneratedColumn()
    id_favorito: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @Column()
    id_producto: number;

    @Column({ type: 'enum', enum: ['Album', 'Cancion'] })
    tipo_producto: string;
}
