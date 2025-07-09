import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfiguracionesService } from './configuraciones.service';
import { CreateConfiguracioneDto } from './dto/create-configuracione.dto';
import { UpdateConfiguracioneDto } from './dto/update-configuracione.dto';

@Controller('configuraciones')
export class ConfiguracionesController {
  constructor(private readonly configuracionesService: ConfiguracionesService) {}

  @Post()
  create(@Body() createConfiguracioneDto: CreateConfiguracioneDto) {
    return this.configuracionesService.create(createConfiguracioneDto);
  }

  @Get()
  findAll() {
    return this.configuracionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configuracionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfiguracioneDto: UpdateConfiguracioneDto) {
    return this.configuracionesService.update(+id, updateConfiguracioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configuracionesService.remove(+id);
  }
}
