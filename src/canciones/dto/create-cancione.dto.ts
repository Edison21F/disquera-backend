import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCancionDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsNumber()
  id_album?: number;

  @IsNotEmpty()
  @IsString()
  duracion: string; // Formato "mm:ss"

  @IsNotEmpty()
  @IsNumber()
  año: number;

  @IsNotEmpty()
  @IsNumber()
  id_genero: number;

  @IsNotEmpty()
  @IsNumber()
  id_artista: number;

  @IsOptional()
  @IsNumber()
  id_estado?: number;

  @IsOptional()
  @IsString()
  foto_url?: string;
}