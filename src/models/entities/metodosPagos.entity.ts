import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MetodoPago {
    @PrimaryGeneratedColumn()
    id_metodo_pago: number;

    @Column({ length: 100 })
    nombre_metodo: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @Column({ default: true })
    activo: boolean;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    comision_porcentaje?: number;

    @Column({ length: 255, nullable: true })
    icono_url?: string;

    @Column({ length: 100, nullable: true })
    proveedor?: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;
}