import { PartialType } from '@nestjs/mapped-types';
import { CreateResenaDto } from './create-resena.dto';
import { IsOptional, IsNumber, IsString, Min, Max, MinLength, MaxLength, IsDateString, IsEnum } from 'class-validator';

export class UpdateResenaDto extends PartialType(CreateResenaDto) {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  calificacion_minima?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  calificacion_maxima?: number;

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
  @IsEnum(['asc', 'desc'])
  orden_calificacion?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}
