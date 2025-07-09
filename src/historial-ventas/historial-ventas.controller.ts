import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialVentasService } from './historial-ventas.service';
import { CreateHistorialVentaDto } from './dto/create-historial-venta.dto';
import { UpdateHistorialVentaDto } from './dto/update-historial-venta.dto';

@Controller('historial-ventas')
export class HistorialVentasController {
  constructor(private readonly historialVentasService: HistorialVentasService) {}

  @Post()
  create(@Body() createHistorialVentaDto: CreateHistorialVentaDto) {
    return this.historialVentasService.create(createHistorialVentaDto);
  }

  @Get()
  findAll() {
    return this.historialVentasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialVentasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialVentaDto: UpdateHistorialVentaDto) {
    return this.historialVentasService.update(+id, updateHistorialVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialVentasService.remove(+id);
  }
}
