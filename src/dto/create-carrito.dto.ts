import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateCarritoDto {
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty()
  @IsNumber()
  id_carrito: number; // ID del carrito de sesión

  @IsNotEmpty()
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  cantidad: number;
}