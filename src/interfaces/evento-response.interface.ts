export interface EventoResponse {
  id_evento: number;
  nombre_evento: string;
  descripcion: string;
  ubicacion: string;
  fecha_evento: Date;
  hora_evento: string;
  capacidad: number;
  contacto: string;
  url_flyer_evento?: string;
  estado?: any;
  genero?: any;
  artista?: any;
  metadatos?: {
    artistas_invitados?: string[];
    archivos_adjuntos?: string[];
    precio_entrada?: any;
    requisitos_tecnicos?: any;
    sponsors?: string;
    politicas_evento?: any;
  };
}
