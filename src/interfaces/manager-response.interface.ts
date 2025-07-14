export interface ManagerResponse {
  id_manager: number;
  nombre_artistico: string;
  fecha_registro: Date;
  sexo?: any;
  estado?: any;
  perfil?: {
    biografia?: string;
    url_imagen_perfil?: string;
    experiencia?: string;
    redes_sociales?: any;
    notas_adicionales?: string;
    artistas_gestionados?: string[];
    contacto_profesional?: any;
    especialidades?: any;
  };
}