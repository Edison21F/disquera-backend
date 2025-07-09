import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialVentaDto } from './create-historial-venta.dto';

export class UpdateHistorialVentaDto extends PartialType(CreateHistorialVentaDto) {}
