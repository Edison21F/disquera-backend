export interface ArtistaResponse {
  id: number;
  nombre: string;
  biografia: string;
  foto_url?: string;
  genero?: any;
  pais?: any;
  estado?: any;
  metadatos?: {
    redes_sociales?: string[];
    rider_tecnico?: any;
    generos_secundarios?: string[];
    manager_contacto?: string;
    discografia_externa?: any[];
  };
}