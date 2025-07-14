import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGeneroDto {
  @IsNotEmpty()
  @IsString()
  nombre_genero: string;
}