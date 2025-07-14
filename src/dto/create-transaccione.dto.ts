import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, Min } from 'class-validator';

export class CreateTransaccioneDto {
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty()
  @IsNumber()
  id_venta: number;

  @IsNotEmpty()
  @IsNumber()
  id_metodo_pago: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  monto: number;

  @IsOptional()
  @IsString()
  @IsEnum(['Pendiente', 'Completada', 'Fallida', 'Cancelada'])
  estado?: 'Pendiente' | 'Completada' | 'Fallida' | 'Cancelada' = 'Pendiente';

  @IsOptional()
  @IsString()
  referencia_externa?: string; // ID de la transacción en el proveedor de pago

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsNumber()
  id_promocion?: number; // Si se aplicó alguna promoción
}