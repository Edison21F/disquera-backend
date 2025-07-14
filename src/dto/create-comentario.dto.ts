import { IsNotEmpty, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateComentarioDto {
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty()
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'El comentario debe tener al menos 3 caracteres' })
  @MaxLength(1000, { message: 'El comentario no puede exceder 1000 caracteres' })
  comentario: string;
}