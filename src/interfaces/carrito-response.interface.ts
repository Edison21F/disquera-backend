export interface CarritoItemResponse {
  id_carrito_prod: number;
  id_carrito: number;
  id_producto: number;
  cantidad: number;
  usuario?: any;
  producto_info?: {
    tipo: string;
    nombre: string;
    precio?: number;
    imagen?: string;
    artista?: string;
  };
}

export interface CarritoSummaryResponse {
  id_carrito: number;
  id_usuario: number;
  items: CarritoItemResponse[];
  total_items: number;
  total_precio?: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}