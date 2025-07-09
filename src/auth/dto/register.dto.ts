import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
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
  @IsString()
  profesion?: string;
}