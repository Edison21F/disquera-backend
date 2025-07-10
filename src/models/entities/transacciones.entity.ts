import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./users.entity";
import { DetalleVenta } from "./detalleVentas.entity";
import { MetodoPago } from "./metodosPagos.entity";
import { Promocion } from "./promociones.entity";

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

    @Column({ type: 'enum', enum: ['Pendiente', 'Completada', 'Fallida', 'Cancelada'], default: 'Pendiente' })
    estado: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;

    @Column({ length: 255, nullable: true })
    referencia_externa?: string;

    @Column({ type: 'text', nullable: true })
    notas?: string;

    @ManyToOne(() => Promocion, { nullable: true })
    promocion?: Promocion;
}