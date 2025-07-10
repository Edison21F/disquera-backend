export interface MetodoPagoResponse {
  id_metodo_pago: number;
  nombre_metodo: string;
  descripcion?: string;
  activo: boolean;
  comision_porcentaje?: number;
  icono_url?: string;
  proveedor?: string;
  fecha_creacion: Date;
  total_transacciones?: number;
}