import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  profesion?: string;

  @IsOptional()
  @IsString()
  foto_perfil_url?: string;

  @IsOptional()
  @IsString()
  redes_sociales?: string;

  @IsOptional()
  @IsArray()
  temas_favoritos?: string[];
}