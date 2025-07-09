import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./users.entity";
import { Estado } from "./estados.entity";


@Entity()
export class DetalleVenta {
    @PrimaryGeneratedColumn()
    id_venta: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @Column()
    id_producto: number;

    @Column({ type: 'enum', enum: ['Album', 'Cancion', 'Merchandising'] })
    tipo_producto: string;

    @Column()
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio_unitario: number;

    @Column({ type: 'datetime' })
    fecha_venta: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto_total: number;

    @ManyToOne(() => Estado)
    estado: Estado;
}
