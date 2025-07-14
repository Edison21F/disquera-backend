import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  Query,
  UseGuards 
} from '@nestjs/common';
import { VentasService } from '../services/ventas.service';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ventasService.findAll(page || 1, limit || 10);
  }

  @Get('stats')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  getStats(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.ventasService.getVentasStats(fechaInicio, fechaFin);
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit?: number) {
    return this.ventasService.getTopSellingProducts(limit || 10);
  }

  @Get('user/:userId')
  // @UseGuards(JwtAuthGuard)
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ventasService.findByUser(userId, page || 1, limit || 10);
  }

  @Get('user/:userId/history')
  // @UseGuards(JwtAuthGuard)
  getUserHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.ventasService.getUserPurchaseHistory(userId);
  }

  @Get('product/:productId/:tipo')
  findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('tipo') tipo: string,
  ) {
    return this.ventasService.findByProduct(productId, tipo);
  }

  @Get('fecha-rango')
  findByDateRange(
    @Query('inicio') fechaInicio: string,
    @Query('fin') fechaFin: string,
  ) {
    return this.ventasService.findByDateRange(fechaInicio, fechaFin);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVentaDto: UpdateVentaDto,
  ) {
    return this.ventasService.update(id, updateVentaDto);
  }

  @Patch(':id/cancel')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.cancelVenta(id);
  }

  @Patch(':id/refund')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  refund(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.refundVenta(id);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.remove(id);
  }
}
