import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CancionesService } from './canciones.service';
import { CreateCancioneDto } from './dto/create-cancione.dto';
import { UpdateCancioneDto } from './dto/update-cancione.dto';

@Controller('canciones')
export class CancionesController {
  constructor(private readonly cancionesService: CancionesService) {}

  @Post()
  create(@Body() createCancioneDto: CreateCancioneDto) {
    return this.cancionesService.create(createCancioneDto);
  }

  @Get()
  findAll() {
    return this.cancionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cancionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCancioneDto: UpdateCancioneDto) {
    return this.cancionesService.update(+id, updateCancioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cancionesService.remove(+id);
  }
}
