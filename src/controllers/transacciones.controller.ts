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
import { TransaccionesService } from '../services/transacciones.service';
import { CreateTransaccioneDto } from '../dto/create-transaccione.dto';
import { UpdateTransaccioneDto } from '../dto/update-transaccione.dto';
import { FilterTransaccionesDto } from '../dto/filter-transacciones.dto';

@Controller('transacciones')
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  create(@Body() createTransaccioneDto: CreateTransaccioneDto) {
    return this.transaccionesService.create(createTransaccioneDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  findAll(@Query() filterDto: FilterTransaccionesDto) {
    return this.transaccionesService.findAll(filterDto);
  }

  @Get('stats')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  getStats(
    @Query('fecha_desde') fechaDesde?: string,
    @Query('fecha_hasta') fechaHasta?: string,
  ) {
    return this.transaccionesService.getTransaccionesStats(fechaDesde, fechaHasta);
  }

  @Get('ingresos-hoy')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  getIngresosHoy(@Query('fecha') fecha?: string) {
    return this.transaccionesService.getIngresosDelDia(fecha);
  }

  @Get('estado/:estado')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  findByEstado(@Param('estado') estado: string) {
    return this.transaccionesService.findByEstado(estado);
  }

  @Get('user/:userId')
  // @UseGuards(JwtAuthGuard)
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.transaccionesService.findByUser(userId, page || 1, limit || 10);
  }

  @Get('venta/:ventaId')
  // @UseGuards(JwtAuthGuard)
  findByVenta(@Param('ventaId', ParseIntPipe) ventaId: number) {
    return this.transaccionesService.findByVenta(ventaId);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transaccionesService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransaccioneDto: UpdateTransaccioneDto,
  ) {
    return this.transaccionesService.update(id, updateTransaccioneDto);
  }

  @Patch(':id/estado')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
    @Body('referencia') referencia?: string,
    @Body('notas') notas?: string,
  ) {
    return this.transaccionesService.updateEstado(id, estado, referencia, notas);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transaccionesService.remove(id);
  }
}