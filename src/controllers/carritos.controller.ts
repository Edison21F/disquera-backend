import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  UseGuards,
  Query 
} from '@nestjs/common';
import { CarritosService } from '../services/carritos.service';
import { CreateCarritoDto } from '../dto/create-carrito.dto';
import { UpdateCarritoDto } from '../dto/update-carrito.dto';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@Controller('carritos')
export class CarritosController {
  constructor(private readonly carritosService: CarritosService) {}

  @Post()
  create(@Body() createCarritoDto: CreateCarritoDto) {
    return this.carritosService.create(createCarritoDto);
  }

  @Post('add/:userId')
  // @UseGuards(JwtAuthGuard)
  addToCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.carritosService.addToCart(userId, addToCartDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  findAll() {
    return this.carritosService.findAll();
  }

  @Get('user/:userId')
  // @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.carritosService.findByUser(userId);
  }

  @Get('user/:userId/active')
  // @UseGuards(JwtAuthGuard)
  findActiveCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.carritosService.findActiveCart(userId);
  }

  @Get('user/:userId/count')
  // @UseGuards(JwtAuthGuard)
  getCartItemCount(@Param('userId', ParseIntPipe) userId: number) {
    return this.carritosService.getCartItemCount(userId);
  }

  @Get('carrito/:carritoId')
  // @UseGuards(JwtAuthGuard)
  findByCarrito(@Param('carritoId', ParseIntPipe) carritoId: number) {
    return this.carritosService.findByCarrito(carritoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carritosService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarritoDto: UpdateCarritoDto,
  ) {
    return this.carritosService.update(id, updateCarritoDto);
  }

  @Patch(':id/quantity')
  // @UseGuards(JwtAuthGuard)
  updateQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body('cantidad') cantidad: number,
  ) {
    return this.carritosService.updateQuantity(id, cantidad);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carritosService.remove(id);
  }

  @Delete('user/:userId/product/:productId')
  // @UseGuards(JwtAuthGuard)
  removeFromCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.carritosService.removeFromCart(userId, productId);
  }

  @Delete('user/:userId/clear')
  // @UseGuards(JwtAuthGuard)
  clearCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('carritoId') carritoId?: number,
  ) {
    return this.carritosService.clearCart(userId, carritoId);
  }

  @Post('user/:userId/move-to-new')
  // @UseGuards(JwtAuthGuard)
  moveToNewCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.carritosService.moveToNewCart(userId);
  }
}