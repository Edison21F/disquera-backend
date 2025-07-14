export interface PromocionResponse {
  id_promocion: number;
  nombre: string;
  descripcion: string;
  tipo_descuento: string;
  valor_descuento?: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  codigo_promocion?: string;
  limite_usos?: number;
  usos_actuales: number;
  monto_minimo_compra?: number;
  productos_aplicables?: string;
  activa: boolean;
  vigente: boolean;
  fecha_creacion: Date;
}