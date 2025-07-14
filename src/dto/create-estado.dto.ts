import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEstadoDto {
  @IsNotEmpty()
  @IsString()
  descripcion: string;
}