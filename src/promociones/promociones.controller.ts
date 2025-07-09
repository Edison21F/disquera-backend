import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { CreatePromocioneDto } from './dto/create-promocione.dto';
import { UpdatePromocioneDto } from './dto/update-promocione.dto';

@Controller('promociones')
export class PromocionesController {
  constructor(private readonly promocionesService: PromocionesService) {}

  @Post()
  create(@Body() createPromocioneDto: CreatePromocioneDto) {
    return this.promocionesService.create(createPromocioneDto);
  }

  @Get()
  findAll() {
    return this.promocionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promocionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromocioneDto: UpdatePromocioneDto) {
    return this.promocionesService.update(+id, updatePromocioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promocionesService.remove(+id);
  }
}
