export interface TransaccionResponse {
  id_transaccion: number;
  id_usuario: number;
  id_venta: number;
  id_metodo_pago: number;
  monto: number;
  estado: string;
  fecha: Date;
  referencia_externa?: string;
  notas?: string;
  id_promocion?: number;
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
  venta?: any;
  metodo_pago?: {
    id_metodo_pago: number;
    nombre_metodo: string;
    comision_porcentaje?: number;
  };
  promocion?: {
    id_promocion: number;
    nombre: string;
    codigo_promocion?: string;
  };
}

export interface TransaccionesPaginatedResponse {
  transacciones: TransaccionResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  resumen: {
    total_monto: number;
    completadas: number;
    pendientes: number;
    fallidas: number;
    canceladas: number;
  };
}

export interface TransaccionesStatsResponse {
  total_transacciones: number;
  monto_total: number;
  transacciones_por_estado: Record<string, number>;
  transacciones_por_metodo: any[];
  ingresos_por_mes: any[];
  promedio_transaccion: number;
  metodos_mas_usados: any[];
}