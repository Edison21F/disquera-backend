import { IsNotEmpty, IsString, IsNumber, IsOptional, IsObject, IsArray } from 'class-validator';

export class CreateManagerDto {
  @IsNotEmpty()
  @IsString()
  nombre_artistico: string;

  @IsNotEmpty()
  @IsNumber()
  id_sexo: number;

  @IsOptional()
  @IsNumber()
  id_estado?: number;

  // Datos adicionales para MongoDB
  @IsOptional()
  @IsString()
  biografia?: string;

  @IsOptional()
  @IsString()
  url_imagen_perfil?: string;

  @IsOptional()
  @IsString()
  experiencia?: string;

  @IsOptional()
  @IsObject()
  redes_sociales?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };

  @IsOptional()
  @IsString()
  notas_adicionales?: string;

  @IsOptional()
  @IsArray()
  artistas_gestionados?: string[];

  @IsOptional()
  contacto_profesional?: {
    telefono?: string;
    email_profesional?: string;
    direccion_oficina?: string;
    horario_atencion?: string;
  };

  @IsOptional()
  especialidades?: {
    generos_musicales?: string[];
    servicios_ofrecidos?: string[];
    idiomas?: string[];
  };
}
