import { PartialType } from '@nestjs/mapped-types';
import { CreateTransaccioneDto } from './create-transaccione.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateTransaccioneDto extends PartialType(CreateTransaccioneDto) {
  @IsOptional()
  @IsString()
  @IsEnum(['Pendiente', 'Completada', 'Fallida', 'Cancelada'])
  estado?: 'Pendiente' | 'Completada' | 'Fallida' | 'Cancelada';

  @IsOptional()
  @IsString()
  referencia_externa?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}