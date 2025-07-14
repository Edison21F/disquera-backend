export interface ComentarioResponse {
  id_comentario: number;
  id_producto: number;
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
  es_autor?: boolean; // Si el usuario actual es el autor del comentario
}

export interface ComentariosPaginatedResponse {
  comentarios: ComentarioResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ComentariosStatsResponse {
  total_comentarios: number;
  comentarios_por_mes: any[];
  usuarios_mas_activos: any[];
  productos_mas_comentados: any[];
}
