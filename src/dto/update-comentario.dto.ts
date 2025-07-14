import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentario.dto';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El comentario debe tener al menos 3 caracteres' })
  @MaxLength(1000, { message: 'El comentario no puede exceder 1000 caracteres' })
  comentario?: string;
}
