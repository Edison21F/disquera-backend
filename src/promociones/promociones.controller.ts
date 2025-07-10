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
import { PromocionesService } from './promociones.service';
import { CreatePromocioneDto } from './dto/create-promocione.dto';
import { UpdatePromocioneDto } from './dto/update-promocione.dto';

@Controller('promociones')
export class PromocionesController {
  constructor(private readonly promocionesService: PromocionesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  create(@Body() createPromocioneDto: CreatePromocioneDto) {
    return this.promocionesService.create(createPromocioneDto);
  }

  @Get()
  findAll() {
    return this.promocionesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.promocionesService.findActive();
  }

  @Get('validate/:codigo')
  validatePromocion(
    @Param('codigo') codigo: string,
    @Query('monto') monto: number,
  ) {
    return this.promocionesService.validatePromocion(codigo, monto);
  }

  @Get('code/:codigo')
  findByCode(@Param('codigo') codigo: string) {
    return this.promocionesService.findByCode(codigo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin', 'Manager')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePromocioneDto: UpdatePromocioneDto
  ) {
    return this.promocionesService.update(id, updatePromocioneDto);
  }

  @Patch(':id/usar')
  // @UseGuards(JwtAuthGuard)
  incrementarUso(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.incrementarUso(id);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.remove(id);
  }
}