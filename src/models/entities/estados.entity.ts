import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Estado {
    @PrimaryGeneratedColumn()
    id_estado: number;

    @Column()
    descripcion: string;
}
