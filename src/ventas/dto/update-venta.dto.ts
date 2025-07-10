import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaDto } from './create-venta.dto';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateVentaDto extends PartialType(CreateVentaDto) {
  @IsOptional()
  @IsEnum(['Pendiente', 'Procesando', 'Completada', 'Cancelada', 'Reembolsada'])
  estado?: string;
}