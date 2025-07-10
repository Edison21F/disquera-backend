import { IsNotEmpty, IsNumber, IsString, IsEnum, IsPositive, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class VentaItemDto {
  @IsNotEmpty()
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['Album', 'Cancion', 'Merchandising'])
  tipo_producto: 'Album' | 'Cancion' | 'Merchandising';

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  precio_unitario: number;
}

export class CreateVentaDto {
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentaItemDto)
  items: VentaItemDto[];

  @IsOptional()
  @IsNumber()
  id_promocion?: number;

  @IsOptional()
  @IsString()
  codigo_descuento?: string;

  @IsOptional()
  @IsNumber()
  descuento_aplicado?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
