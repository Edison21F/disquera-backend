import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaisDto {
  @IsNotEmpty()
  @IsString()
  nombre_pais: string;
}