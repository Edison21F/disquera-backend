import { IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';

export class FilterComentariosDto {
  @IsOptional()
  @IsNumber()
  id_usuario?: number;

  @IsOptional()
  @IsNumber()
  id_producto?: number;

  @IsOptional()
  @IsDateString()
  fecha_desde?: string;

  @IsOptional()
  @IsDateString()
  fecha_hasta?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orden_fecha?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}