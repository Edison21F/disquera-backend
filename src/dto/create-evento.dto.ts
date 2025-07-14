import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateEventoDto {
  @IsNotEmpty()
  @IsString()
  nombre_evento: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsString()
  ubicacion: string;

  @IsNotEmpty()
  @IsDateString()
  fecha_evento: string;

  @IsNotEmpty()
  @IsString()
  hora_evento: string; // Formato "HH:mm"

  @IsNotEmpty()
  @IsNumber()
  capacidad: number;

  @IsNotEmpty()
  @IsNumber()
  id_estado: number;

  @IsNotEmpty()
  @IsNumber()
  id_genero: number;

  @IsNotEmpty()
  @IsString()
  contacto: string;

  @IsNotEmpty()
  @IsNumber()
  id_artista: number;

  @IsOptional()
  @IsString()
  url_flyer_evento?: string;

  // Datos adicionales para MongoDB
  @IsOptional()
  @IsArray()
  artistas_invitados?: string[];

  @IsOptional()
  @IsArray()
  archivos_adjuntos?: string[];

  @IsOptional()
  precio_entrada?: {
    general?: number;
    vip?: number;
    estudiantes?: number;
  };

  @IsOptional()
  requisitos_tecnicos?: {
    sonido?: string[];
    iluminacion?: string[];
    escenario?: string;
    otros?: string;
  };

  @IsOptional()
  @IsString()
  sponsors?: string;

  @IsOptional()
  politicas_evento?: {
    edad_minima?: number;
    prohibiciones?: string[];
    reembolsos?: string;
  };
}
