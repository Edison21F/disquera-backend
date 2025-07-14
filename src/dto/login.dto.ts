import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @IsString()
  contrasena: string;
}