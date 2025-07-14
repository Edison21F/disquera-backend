import { IsOptional, IsNumber, IsDateString, IsEnum, IsString } from 'class-validator';

export class FilterTransaccionesDto {
  @IsOptional()
  @IsNumber()
  id_usuario?: number;

  @IsOptional()
  @IsNumber()
  id_metodo_pago?: number;

  @IsOptional()
  @IsEnum(['Pendiente', 'Completada', 'Fallida', 'Cancelada'])
  estado?: 'Pendiente' | 'Completada' | 'Fallida' | 'Cancelada';

  @IsOptional()
  @IsDateString()
  fecha_desde?: string;

  @IsOptional()
  @IsDateString()
  fecha_hasta?: string;

  @IsOptional()
  @IsNumber()
  monto_minimo?: number;

  @IsOptional()
  @IsNumber()
  monto_maximo?: number;

  @IsOptional()
  @IsString()
  referencia_externa?: string;

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