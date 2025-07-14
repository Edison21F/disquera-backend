import { IsNotEmpty, IsString, IsDateString, IsEnum, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class CreatePromocioneDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['Porcentaje', 'Monto_Fijo', 'Envio_Gratis', '2x1'])
  tipo_descuento: 'Porcentaje' | 'Monto_Fijo' | 'Envio_Gratis' | '2x1';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  valor_descuento?: number;

  @IsNotEmpty()
  @IsDateString()
  fecha_inicio: string;

  @IsNotEmpty()
  @IsDateString()
  fecha_fin: string;

  @IsOptional()
  @IsString()
  codigo_promocion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  limite_usos?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monto_minimo_compra?: number;

  @IsOptional()
  @IsString()
  productos_aplicables?: string; // JSON string con IDs de productos

  @IsOptional()
  @IsBoolean()
  activa?: boolean = true;
}