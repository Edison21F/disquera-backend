import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./users.entity";
import { DetalleVenta } from "./detalleVentas.entity";
import { MetodoPago } from "./metodosPagos.entity";


@Entity()
export class Transaccion {
    @PrimaryGeneratedColumn()
    id_transaccion: number;

    @ManyToOne(() => Usuario)
    usuario: Usuario;

    @ManyToOne(() => DetalleVenta)
    venta: DetalleVenta;

    @ManyToOne(() => MetodoPago)
    metodo_pago: MetodoPago;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: number;

    @Column({ type: 'datetime' })
    fecha: Date;
}
