import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsNumber()
  id_artista: number;

  @IsNotEmpty()
  @IsNumber()
  año: number;

  @IsNotEmpty()
  @IsNumber()
  id_genero: number;

  @IsOptional()
  @IsNumber()
  id_estado?: number;

  @IsOptional()
  @IsString()
  foto_url?: string;
}