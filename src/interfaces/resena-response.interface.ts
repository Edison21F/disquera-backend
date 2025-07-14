export interface ResenaResponse {
  id_resena: number;
  id_producto: number;
  calificacion: number;
  comentario: string;
  fecha: Date;
  fecha_editado?: Date;
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    foto_perfil?: string;
  };
  producto_info?: {
    tipo: string;
    titulo: string;
    artista?: string;
  };
  es_autor?: boolean;
  util_count?: number; // Para futura implementación de "útil"
}

export interface ResenasPaginatedResponse {
  resenas: ResenaResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  promedio_calificacion: number;
  distribucion_calificaciones: Record<number, number>;
}

export interface ProductRatingsSummary {
  id_producto: number;
  total_resenas: number;
  promedio_calificacion: number;
  distribucion_calificaciones: Record<number, number>;
  resenas_recientes: ResenaResponse[];
}

export interface ResenasStatsResponse {
  total_resenas: number;
  promedio_general: number;
  resenas_por_mes: any[];
  productos_mejor_valorados: any[];
  usuarios_mas_activos: any[];
  distribucion_calificaciones_global: Record<number, number>;
}
