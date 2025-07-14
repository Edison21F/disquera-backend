export interface UserResponse {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  fecha_registro: Date;
  estado?: any;
  rol?: any;
  sexo?: any;
  pais?: any;
  perfil?: {
    profesion?: string;
    foto_perfil_url?: string;
    redes_sociales?: string;
    temas_favoritos?: string[];
  };
}