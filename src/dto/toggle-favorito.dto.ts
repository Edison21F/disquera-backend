import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class ToggleFavoritoDto {
  @IsNotEmpty()
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['Album', 'Cancion'])
  tipo_producto: 'Album' | 'Cancion';
}