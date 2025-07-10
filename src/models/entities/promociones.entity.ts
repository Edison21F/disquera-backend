import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Promocion {
    @PrimaryGeneratedColumn()
    id_promocion: number;

    @Column({ length: 100 })
    nombre: string;

    @Column('text')
    descripcion: string;

    @Column({ type: 'enum', enum: ['Porcentaje', 'Monto_Fijo', 'Envio_Gratis', '2x1'] })
    tipo_descuento: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    valor_descuento?: number;

    @Column()
    fecha_inicio: Date;

    @Column()
    fecha_fin: Date;

    @Column({ length: 50, unique: true, nullable: true })
    codigo_promocion?: string;

    @Column({ nullable: true })
    limite_usos?: number;

    @Column({ default: 0 })
    usos_actuales: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    monto_minimo_compra?: number;

    @Column({ type: 'text', nullable: true })
    productos_aplicables?: string;

    @Column({ default: true })
    activa: boolean;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion: Date;
}