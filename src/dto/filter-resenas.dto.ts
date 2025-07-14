import { IsOptional, IsNumber, IsDateString, IsEnum, Min, Max, IsString, MinLength, MaxLength } from 'class-validator';

export class FilterResenasDto {
  @IsOptional()
  @IsNumber()
  id_usuario?: number;

  @IsOptional()
  @IsNumber()
  id_producto?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'La calificación mínima es 1' })
  @Max(5, { message: 'La calificación máxima es 5' })
  calificacion?: number;

  
 
  calificacion_minima?: number;
  calificacion_maxima?: number;
  fecha_desde?: Date;
  fecha_hasta?: Date;
  orden_calificacion?: 'asc' | 'desc';
  orden_fecha?: 'asc' | 'desc';
  page?: number;
  limit?: number;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'La reseña debe tener al menos 10 caracteres' })
  @MaxLength(2000, { message: 'La reseña no puede exceder 2000 caracteres' })
  comentario?: string;
}