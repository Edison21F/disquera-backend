import { IsNotEmpty, IsString, IsNumber, Min, Max, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateResenaDto {
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty()
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'La calificación mínima es 1' })
  @Max(5, { message: 'La calificación máxima es 5' })
  calificacion: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'La reseña debe tener al menos 10 caracteres' })
  @MaxLength(2000, { message: 'La reseña no puede exceder 2000 caracteres' })
  comentario: string;
}
