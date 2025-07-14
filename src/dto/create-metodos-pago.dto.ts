import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateMetodosPagoDto {
  @IsNotEmpty()
  @IsString()
  nombre_metodo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;

  @IsOptional()
  @IsNumber()
  comision_porcentaje?: number;

  @IsOptional()
  @IsString()
  icono_url?: string;

  @IsOptional()
  @IsString()
  proveedor?: string;
}