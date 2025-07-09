import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contraseña: string;

  @IsOptional()
  @IsNumber()
  id_estado?: number;

  @IsOptional()
  @IsNumber()
  id_rol?: number;

  @IsOptional()
  @IsNumber()
  id_sexo?: number;

  @IsOptional()
  @IsNumber()
  id_pais?: number;

  // Datos adicionales para MongoDB (perfil extendido)
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