export interface VentaItemResponse {
  id_venta: number;
  id_producto: number;
  tipo_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto_info?: {
    titulo: string;
    artista?: string;
    imagen?: string;
  };
}

export interface VentaResponse {
  id_venta: number;
  numero_venta: string;
  fecha_venta: Date;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  estado: string;
  items: VentaItemResponse[];
  usuario?: any;
  promocion?: any;
  metadatos?: {
    codigo_descuento?: string;
    notas?: string;
    direccion_envio?: any;
    metodo_entrega?: string;
  };
}

export interface VentasStatsResponse {
  total_ventas: number;
  total_ingresos: number;
  venta_promedio: number;
  ventas_por_mes: any[];
  productos_mas_vendidos: any[];
  usuarios_top: any[];
  estados_distribucion: Record<string, number>;
}