import { PartialType } from '@nestjs/mapped-types';
import { CreateCarritoDto } from './create-carrito.dto';
import { IsOptional, IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateCarritoDto extends PartialType(CreateCarritoDto) {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  cantidad?: number;
}