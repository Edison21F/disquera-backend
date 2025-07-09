import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./users.entity";
import { DetalleVenta } from "./detalleVentas.entity";


@Entity()
export class HistorialVenta {
    @PrimaryGeneratedColumn()
    id_historial: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @ManyToOne(() => DetalleVenta)
    venta: DetalleVenta;

    @Column({ type: 'datetime' })
    fecha: Date;
}
