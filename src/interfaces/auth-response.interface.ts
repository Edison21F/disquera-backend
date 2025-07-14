export interface AuthResponse {
  access_token: string;
  user: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  };
}