import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateFavoritoDto {
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty()
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['Album', 'Cancion'])
  tipo_producto: 'Album' | 'Cancion';
}