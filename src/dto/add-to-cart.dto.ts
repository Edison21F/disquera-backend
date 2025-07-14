import { IsNotEmpty, IsNumber, IsString, IsOptional, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  @IsString()
  tipo_producto: 'Album' | 'Cancion' | 'Merchandising';

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  cantidad?: number = 1;
}