export interface FavoritoResponse {
  id_favorito: number;
  id_producto: number;
  tipo_producto: 'Album' | 'Cancion';
  fecha_agregado: Date;
  usuario?: any;
  producto_info?: {
    titulo: string;
    artista?: string;
    año?: number;
    imagen?: string;
    duracion?: string; // Para canciones
    genero?: string;
  };
}

export interface FavoritosGroupedResponse {
  albums: FavoritoResponse[];
  canciones: FavoritoResponse[];
  total_albums: number;
  total_canciones: number;
  total_general: number;
}