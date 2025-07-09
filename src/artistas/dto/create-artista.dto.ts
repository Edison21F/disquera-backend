// src/artistas/dto/create-artista.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, IsObject } from 'class-validator';

export class CreateArtistaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  id_genero?: number;

  @IsOptional()
  @IsNumber()
  id_pais?: number;

  @IsNotEmpty()
  @IsString()
  biografia: string;

  @IsOptional()
  @IsNumber()
  id_estado?: number;

  @IsOptional()
  @IsString()
  foto_url?: string;

  // Datos adicionales para MongoDB
  @IsOptional()
  @IsArray()
  redes_sociales?: string[];

  @IsOptional()
  @IsObject()
  rider_tecnico?: any;

  @IsOptional()
  @IsArray()
  generos_secundarios?: string[];

  @IsOptional()
  @IsString()
  manager_contacto?: string;

  @IsOptional()
  @IsArray()
  discografia_externa?: any[];
}
